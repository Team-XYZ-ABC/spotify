import dotenv from 'dotenv'

dotenv.config()

const CONFIG = {
    PORT: process.env.PORT,
    MONGO_URI: process.env.MONGO_URI,
    SERVER_HOST: process.env.SERVER_HOST
}

export default CONFIG