import * as userDao from "./user.dao.js";
import * as artistDao from "../artist/artist.dao.js";
import ApiError from "../../lib/api-error.js";
import { ROLES } from "../../constants.js";
import { signObjectUrl, publicUrl } from "../../utils/media-url.util.js";

const sanitiseUser = async (userObj) => ({
    ...userObj,
    avatar: await signObjectUrl(userObj.avatarKey, userObj.avatar),
});

const getMyProfile = async (userId) => {
    const userDoc = await userDao.findById(userId);
    if (!userDoc) throw ApiError.notFound("User not found");
    const user = await sanitiseUser(userDoc.toObject());

    if (user.role === ROLES.ARTIST) {
        const artist = await artistDao.findByUser(userId);
        return { user, artist };
    }
    return { user };
};

const updateMyProfile = async (userId, { displayName, bio, avatarKey }) => {
    if (!displayName && !bio && !avatarKey) {
        throw ApiError.badRequest("No data provided to update");
    }
    const user = await userDao.findById(userId);
    if (!user) throw ApiError.notFound("User not found");

    if (avatarKey) {
        user.avatar = publicUrl(avatarKey);
        user.avatarKey = avatarKey;
    }
    if (displayName) user.displayName = displayName;
    if (bio !== undefined) user.bio = bio;

    await user.save();

    return {
        _id: user._id,
        displayName: user.displayName,
        bio: user.bio,
        email: user.email,
        username: user.username,
        role: user.role,
        avatarKey: user.avatarKey,
        avatar: await signObjectUrl(user.avatarKey, user.avatar),
    };
};

const getOtherUserProfile = async (id) => {
    const user = await userDao.findById(id, {
        select: "-password -refreshToken -__v -updatedAt",
        lean: true,
    });
    if (!user) throw ApiError.notFound("User not found");
    const safe = await sanitiseUser(user);

    if (safe.role === ROLES.ARTIST) {
        const artist = await artistDao.findByUser(id);
        return { user: safe, artist };
    }
    return { user: safe };
};

export default { getMyProfile, updateMyProfile, getOtherUserProfile };
