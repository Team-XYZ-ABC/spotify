import UserModel from "../models/user.model.js"
import jwt from 'jsonwebtoken'
import CONFIG from "../configs/env.config.js"
import bcrypt from 'bcrypt'
import { jwtSign, jwtVerify } from "../services/jwt.service.js"

export const registerUser = async (req, res) => {
    const { displayName, username, email, password, role } = req.body;

    try {
        if (!displayName) {
            return res.status(400).json({ message: "Display name is required" });
        }

        if (!username) {
            return res.status(400).json({ message: "Username is required" });
        }

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        if (!password) {
            return res.status(400).json({ message: "Password is required" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }

        const existingUser = await UserModel.findOne({ $or: [{ email }, { username }] });

        if (existingUser?.email === email) {
            return res.status(400).json({ message: "Email already in use" });
        }

        if (existingUser?.username === username) {
            return res.status(400).json({ message: "Username already in use" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new UserModel({
            displayName,
            username,
            email,
            password: hashedPassword,
            role
        });

        await newUser.save();

        const token = jwtSign(newUser);

        res.cookie('token', token, {
            httpOnly: true,
            secure: CONFIG.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: newUser._id,
                role: newUser.role
            }
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error", error: error.message
        })
    }
}

export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await UserModel.findOne({ email }).select('+password');

        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const token = jwtSign(user);

        res.cookie('token', token, {
            httpOnly: true,
            secure: CONFIG.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({
            message: "User logged in successfully",
            user: {
                id: user._id,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error", error: error.message
        })
    }
}

export const logoutUser = async (req, res) => {
    try {
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

export const GetCurrentUser = async (req, res) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const decoded = jwtVerify(token);

        const user = await UserModel.findById(decoded.userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            user: {
                id: user._id,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error", error: error.message
        })
    }
}