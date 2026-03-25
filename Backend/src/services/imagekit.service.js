import { toFile } from "@imagekit/nodejs";
import imagekit from "../configs/imagekit.config.js";


export const uploadSong = async(buffer , fileName , folder="")=>{
    const result = await imagekit.files.upload({
        file: await toFile(buffer , fileName),
        fileName: fileName,
        filePath: `${folder}/${fileName}`
    })
return result
}