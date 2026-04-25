import ArtistModel from "../models/artist.model.js";
import UserModel from "../models/user.model.js";
import { getCloudFrontUrl, getPresignedGetUrl, getS3KeyFromUrl } from "../services/s3.service.js";
import CONFIG from "../configs/env.config.js";

export const getProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await UserModel.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Replace avatar with a fresh presigned GET URL
        const userObj = user.toObject();
        const avatarS3Key = userObj.avatarKey || getS3KeyFromUrl(userObj.avatar);
        if (avatarS3Key) {
            userObj.avatar = await getPresignedGetUrl(avatarS3Key, 86400); // 24 hours
        }

        if (userObj.role === "listener") {
            return res.status(200).json({
                success: true,
                user: userObj
            });
        }

        if (userObj.role === "artist") {
            const artist = await ArtistModel.findOne({ user: userId });
            return res.status(200).json({
                message: "logged in user profile fetched successfully",
                success: true,
                user: userObj,
                artist
            });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}

export const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        const { displayName, bio, avatarKey } = req.body || {};

        const user = await UserModel.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        if (!displayName && !bio && !avatarKey) {
            return res.status(400).json({
                message: "No data provided to update"
            });
        }

        if (avatarKey) {
            user.avatar = getCloudFrontUrl(avatarKey);
            user.avatarKey = avatarKey;
        }

        if (displayName) user.displayName = displayName;
        if (bio) user.bio = bio;

        await user.save();

        // Build presigned avatar URL for the response
        const avatarS3Key = user.avatarKey || getS3KeyFromUrl(user.avatar);
        const signedAvatar = avatarS3Key
            ? await getPresignedGetUrl(avatarS3Key, 86400)
            : user.avatar;

        const safeUser = {
            _id: user._id,
            displayName: user.displayName,
            bio: user.bio,
            email: user.email,
            username: user.username,
            role: user.role,
            avatarKey: user.avatarKey,
            avatar: signedAvatar,
        };

        res.status(200).json({
            message: "Profile updated successfully",
            user: safeUser
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

export const getOtherUserProfile = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await UserModel.findById(id)
            .select("-password -refreshToken -__v -updatedAt")
            .lean();

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Replace avatar with a fresh presigned GET URL
        const avatarS3Key = user.avatarKey || getS3KeyFromUrl(user.avatar);
        if (avatarS3Key) {
            user.avatar = await getPresignedGetUrl(avatarS3Key, 86400); // 24 hours
        }

        if (user.role === "listener") {
            return res.status(200).json({
                message: "user profile fetched successfully",
                success: true,
                user
            });
        }

        if (user.role === "artist") {
            const artist = await ArtistModel.findOne({ user: id });
            return res.status(200).json({
                message: "user profile fetched successfully",
                success: true,
                user,
                artist
            });
        }

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

export const getHistory = async (req, res) => {
    res.send("get history")
}

export const getRecentlyPlayed = async (req, res) => {
    res.send("get recently played")
}
