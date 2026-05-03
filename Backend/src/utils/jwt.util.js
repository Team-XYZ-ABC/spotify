import jwt from "jsonwebtoken";
import config from "../config.js";

export const jwtSign = (payload) =>
    jwt.sign(payload, config.auth.jwtSecret, { expiresIn: config.auth.jwtExpiresIn });

export const jwtVerify = (token) => jwt.verify(token, config.auth.jwtSecret);
