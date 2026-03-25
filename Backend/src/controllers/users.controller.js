import ArtistModel from "../models/artist.model.js";
import UserModel from "../models/user.model.js";

export const getProfile = async(req, res)=>{
    try {
        const userId = req.user.id;

        const user = await UserModel.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.role === "listener") {
            return res.status(200).json({
                success: true,
                user
            });
        }

        if (user.role === "artist") {
            const artist = await ArtistModel.findOne({ user: userId });
            return res.status(200).json({
                success: true,
                user,
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

        const { displayName, bio } = req.body;

        const updateData = {};

        if (displayName) updateData.displayName = displayName;
        if (bio) updateData.bio = bio;

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                message: "No data provided to update"
            });
        }

        const user = await UserModel.findByIdAndUpdate(
            userId,
            updateData,
            { new: true }
        )
            .select("-password -refreshToken -__v")
            .lean();

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            message: "Profile updated successfully",
            user
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

        res.status(200).json({
            message: "Profile fetched successfully",
            user
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

export const getHistory = async(req, res)=>{
        res.send("get history")
}

export const getRecentlyPlayed = async(req, res)=>{
        res.send("get recently played")
}
