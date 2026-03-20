import UserModel from "../models/user.model.js"
import jwt from 'jsonwebtoken'
import CONFIG from "../configs/env.config.js"
import ArtistModel from "../models/artist.model.js"

export const userRegisterUser = async(req, res)=>{
    const {email, password, username, role, displayName} = req.body

    if (!email || !password || !username || !displayName){
        return res.status(400).json({
            message: "All field are required",
            success: false
        })
    }

    const user = await UserModel.create({
        email, password, username, role, displayName
    })

    if(user.role === 'artist' ){
        await ArtistModel.create({
            user: user._id
        })
    }


    const token = jwt.sign({user}, CONFIG.JWT_SECRET_KEY, {expiresIn: '1d'} )

    res.cookie("token", token , {
        maxAge: 24 * 60 * 60 * 1000
    })
    
    res.status(201).json({
        message: "User registered successfully",
        user
    })
}


export const userLoginUser = async(req, res)=>{
    res.send("user login")
}

export const userLogout = async(req, res)=>{
    res.send("user logout")
}


export const artistRegisterUser = async(req, res)=>{
    res.send("artist register")
}

export const artistLoginUser = async(req, res)=>{
    res.send("artist login")
}

export const artistLogout = async(req, res)=>{
    res.send("artist logout")
}
