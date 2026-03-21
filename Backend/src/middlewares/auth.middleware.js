import CONFIG from '../configs/env.config.js'
import jwt from 'jsonwebtoken'

const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies?.token

        if (!token) {
            return res.status(401).json({
                message: "Unauthorized - Please login!",
                success: false
            })
        }

        const decoded = jwt.verify(token, CONFIG.JWT_SECRET_KEY)

        req.user = decoded.user

        next()

    } catch (error) {
        return res.status(401).json({
            message: "Unauthorized",
            success: false
        })
    }
}

export default isAuthenticated