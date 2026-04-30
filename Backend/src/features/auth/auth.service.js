import bcrypt from "bcrypt";
import mongoose from "mongoose";
import userRepository from "../user/user.repository.js";
import artistRepository from "../artist/artist.repository.js";
import ApiError from "../../core/http/api-error.js";
import { ROLES } from "../../core/constants/index.js";
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

class AuthService {
    /**
     * @returns {Promise<boolean>}
     */
    async emailExists(email) {
        const exists = await userRepository.emailExists(email);
        return Boolean(exists);
    }

    /**
     * Registers a new user (and an Artist profile if role === "artist").
     * Returns { user, token } — caller is responsible for setting the cookie.
     */
    async register({ displayName, username, email, password, role }) {
        const normalizedEmail = email.toLowerCase();
        const normalizedUsername = username.toLowerCase().trim();
        const userRole = ALLOWED_ROLES.includes(role) ? role : ROLES.LISTENER;

        const existing = await userRepository.findOne({
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
            const newUser = await userRepository.create(
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
                await artistRepository.create(
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
    }

    async login({ email, password }) {
        const identifier = email.toLowerCase();

        const user = await userRepository.findOne(
            { $or: [{ email: identifier }, { username: identifier }] },
            { select: "+password" }
        );
        if (!user) throw ApiError.badRequest("Invalid email or password");
        if (user.isActive === false) throw ApiError.forbidden("Account is disabled");

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) throw ApiError.badRequest("Invalid email or password");

        const token = jwtSign({ id: user._id, role: user.role });
        return { token, user: await buildAuthUser(user) };
    }

    /**
     * Resolves the current user from a verified token payload.
     */
    async getCurrentUser(userId) {
        const user = await userRepository.findById(userId, {
            select: "_id username role isActive avatar avatarKey displayName email",
        });
        if (!user) throw ApiError.notFound("User not found");
        if (user.isActive === false) throw ApiError.forbidden("Account disabled");
        return buildAuthUser(user);
    }
}

export default new AuthService();
