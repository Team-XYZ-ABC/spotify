import UserModel from "../models/user.model.js"
import CONFIG from "../configs/env.config.js"
import bcrypt from 'bcrypt'
import { jwtSign, jwtVerify } from "../services/jwt.service.js"
import mongoose from "mongoose"
import ArtistModel from "../models/artist.model.js"

export const isEmailExist = async (req, res) => {
    try {
        let { email } = req.body;

        if (!email) {
            return res.status(400).json({
                message: "Email is required"
            });
        }

        email = email.toLowerCase().trim();

        const exists = await UserModel.exists({ email });

        return res.status(200).json({
            exists: !!exists
        });

    } catch (error) {
        return res.status(500).json({
            message: "Server error"
        });
    }
};

export const registerUser = async (req, res) => {
    const session = await mongoose.startSession();

    try {
        let { displayName, username, email, password, role } = req.body;

        if (!displayName || !username || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters long"
            });
        }

        email = email.toLowerCase();
        username = username.toLowerCase().trim();

        const existingUser = await UserModel.findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser) {
            return res.status(400).json({
                message:
                    existingUser.email === email
                        ? "Email already in use"
                        : "Username already in use"
            });
        }

        const allowedRoles = ["listener", "artist"];
        const userRole = allowedRoles.includes(role) ? role : "listener";

        const hashedPassword = await bcrypt.hash(password, 10);

        session.startTransaction();

        const [newUser] = await UserModel.create(
            [{
                displayName,
                username,
                email,
                password: hashedPassword,
                role: userRole
            }],
            { session }
        );

        if (userRole === "artist") {
            await ArtistModel.create(
                [{
                    user: newUser._id
                }],
                { session }
            );
        }

        await session.commitTransaction();

        const token = jwtSign({
            id: newUser._id,
            role: newUser.role
        });

        res.cookie("token", token, {
            httpOnly: true,
            secure: CONFIG.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: newUser._id,
                username: newUser.username,
                role: newUser.role
            }
        });

    } catch (error) {

        await session.abortTransaction();

        res.status(500).json({
            message: error.message
        });

    } finally {
        session.endSession();
    }
};

export const loginUser = async (req, res) => {
    try {
        let { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        email = email.toLowerCase();

        const user = await UserModel.findOne({
            $or: [{ email }, { username: email }]
        }).select("+password");

        if (!user) {
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }

        if (!user.isActive) {
            return res.status(403).json({
                message: "Account is disabled"
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }

        const token = jwtSign({
            id: user._id,
            role: user.role
        });

        res.cookie("token", token, {
            httpOnly: true,
            secure: CONFIG.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({
            message: "User logged in successfully",
            user: {
                id: user._id,
                username: user.username,
                role: user.role
            }
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

export const logoutUser = async (req, res) => {
    try {

        const token = req.cookies?.token;

        if (!token) {
            return res.status(400).json({ message: "Unauthorized" });
        }

        res.clearCookie('token', {
            httpOnly: true,
            secure: CONFIG.NODE_ENV === 'production',
            sameSite: 'strict'
        });

        res.status(200).json({ message: "User logged out successfully" });
    }
    catch (error) {
        res.status(500).json({
            message: "Server error", error: error.message
        })
    }
}

export const getCurrentUser = async (req, res) => {
    try {
        const token = req.cookies?.token;

        if (!token) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        const decoded = jwtVerify(token);
        const user = await UserModel.findById(decoded.id)
            .select("_id username role isActive");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        if (!user.isActive) {
            return res.status(403).json({
                message: "Account disabled"
            });
        }

        res.status(200).json({
            message: "logged in user fetched successfully",
            user: {
                id: user._id,
                username: user.username,
                role: user.role
            }
        });

    } catch (error) {
        res.status(401).json({
            message: "Invalid or expired token"
        });
    }
};