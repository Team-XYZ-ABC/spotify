import CONFIG from '../configs/env.config';
import jwt from 'jsonwebtoken'

const auth = async(req,res, next)=>{
    const token = req.cookies.token;
    if(!token){
        return res.status(400).json({
            message: "You are unauthorized",
            success: false
        })
    }

    const decoded = jwt.verify(token, CONFIG.JWT_SECRET_KEY)
    req.user = decoded.user
}