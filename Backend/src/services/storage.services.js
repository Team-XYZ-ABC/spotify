import ImageKit, { toFile } from "@imagekit/nodejs"
import CONFIG from "../configs/env.config.js"


const client = new ImageKit({
    privateKey: CONFIG.IMAGEKIT_PRIVATE_KEY
})

export const uploadFile = async (buffer, fileName, folder = "") => {
  return await client.files.upload({
    file: await toFile(buffer,"file"),
    fileName: fileName,
    folder: folder,
  });
};

