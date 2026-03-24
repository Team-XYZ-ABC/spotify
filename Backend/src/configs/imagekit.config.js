import ImageKit from "@imagekit/nodejs"
import CONFIG from "../configs/env.config.js"


const imagekit = new ImageKit({
    privateKey: CONFIG.IMAGEKIT_PRIVATE_KEY
})

export default imagekit