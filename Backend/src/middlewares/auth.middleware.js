import CONFIG from '../configs/env.config.js'
import jwt from 'jsonwebtoken'
import {
    jwtVerify
} from '../services/jwt.service.js'

const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies?.token

        if (!token) {
            return res.status(401).json({
                message: "Unauthorized - Please login!",
                success: false
            })
        }

        const decoded = jwtVerify(token, CONFIG.JWT_SECRET_KEY)
        req.user = decoded

        next()

    } catch (error) {
        return res.status(401).json({
            message: "Unauthorized",
            success: false
        })
    }
}

export default isAuthenticated