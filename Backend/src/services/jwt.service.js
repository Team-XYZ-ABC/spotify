import jwt from 'jsonwebtoken'
import CONFIG from '../configs/env.config.js'

export const jwtSign = (user)=>{
    const token = jwt.sign({
        id: user._id,
        role: user.role
    }, CONFIG.JWT_SECRET_KEY, {expiresIn: '7d'})
    return token
}

export const jwtVerify = (token)=>{
    const decoded = jwt.verify(token, CONFIG.JWT_SECRET_KEY)
    return decoded
}