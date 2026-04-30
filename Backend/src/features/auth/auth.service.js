import bcrypt from "bcrypt";
import mongoose from "mongoose";
import * as userDao from "../user/user.dao.js";
import * as artistDao from "../artist/artist.dao.js";
import ApiError from "../../lib/api-error.js";
import { ROLES } from "../../constants.js";
import { jwtSign } from "../../utils/jwt.util.js";
import { signObjectUrl } from "../../utils/media-url.util.js";

const ALLOWED_ROLES = [ROLES.LISTENER, ROLES.ARTIST];

const buildAuthUser = async (user) => ({
    id: user._id,
    username: user.username,
    displayName: user.displayName,
    email: user.email,
    role: user.role,
    avatar: await signObjectUrl(user.avatarKey, user.avatar),
});

const emailExists = async (email) => {
    const exists = await userDao.emailExists(email);
    return Boolean(exists);
};

const register = async ({ displayName, username, email, password, role }) => {
    const normalizedEmail = email.toLowerCase();
    const normalizedUsername = username.toLowerCase().trim();
    const userRole = ALLOWED_ROLES.includes(role) ? role : ROLES.LISTENER;

    const existing = await userDao.findOne({
        $or: [{ email: normalizedEmail }, { username: normalizedUsername }],
    });
    if (existing) {
        throw ApiError.conflict(
            existing.email === normalizedEmail
                ? "Email already in use"
                : "Username already in use"
        );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        const newUser = await userDao.create(
            {
                displayName,
                username: normalizedUsername,
                email: normalizedEmail,
                password: hashedPassword,
                role: userRole,
            },
            { session }
        );

        if (userRole === ROLES.ARTIST) {
            await artistDao.create(
                { user: newUser._id, stageName: displayName || normalizedUsername },
                { session }
            );
        }

        await session.commitTransaction();

        const token = jwtSign({ id: newUser._id, role: newUser.role });
        return {
            token,
            user: {
                id: newUser._id,
                username: newUser.username,
                role: newUser.role,
            },
        };
    } catch (err) {
        await session.abortTransaction();
        throw err;
    } finally {
        session.endSession();
    }
};

const login = async ({ email, password }) => {
    const identifier = email.toLowerCase();

    const user = await userDao.findOne(
        { $or: [{ email: identifier }, { username: identifier }] },
        { select: "+password" }
    );
    if (!user) throw ApiError.badRequest("Invalid email or password");
    if (user.isActive === false) throw ApiError.forbidden("Account is disabled");

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) throw ApiError.badRequest("Invalid email or password");

    const token = jwtSign({ id: user._id, role: user.role });
    return { token, user: await buildAuthUser(user) };
};

const getCurrentUser = async (userId) => {
    const user = await userDao.findById(userId, {
        select: "_id username role isActive avatar avatarKey displayName email",
    });
    if (!user) throw ApiError.notFound("User not found");
    if (user.isActive === false) throw ApiError.forbidden("Account disabled");
    return buildAuthUser(user);
};

export default { emailExists, register, login, getCurrentUser };
