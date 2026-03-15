import dotenv from 'dotenv'

dotenv.config()

const CONFIG = {
    PORT: process.env.PORT,
    MONGO_URI: process.env.MONGO_URI,
    SERVER_HOST: process.env.SERVER_HOST,
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY
}

export default CONFIG