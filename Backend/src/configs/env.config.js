import dotenv from 'dotenv'

dotenv.config()

const config = {
    PORT: process.env.PORT,
    SERVER_HOST: process.env.SERVER_HOST,
    MONGO_URI: process.env.MONGO_URI
}

export default config