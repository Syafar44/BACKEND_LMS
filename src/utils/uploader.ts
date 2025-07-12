import { v2 as cloudinary } from 'cloudinary'


import {CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET} from './env'

cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET
})

const toDataURL = (file: Express.Multer.File) => {
    const b64 = Buffer.from(file.buffer).toString("base64")
    const dataURL = `data:${file.mimetype};base64,${b64}`
    return dataURL
}

const getPublicIdFromFIleUrl = (fileUrl: string) => {
    const fileNameUsingSubstring = fileUrl.substring(
        fileUrl.lastIndexOf('/') + 1
    )

    const publidId = fileNameUsingSubstring.substring(0, fileNameUsingSubstring.lastIndexOf('.'))
    return publidId
}

export default {
    async uploadSingle(file: Express.Multer.File) {
        const fileDataUrl = toDataURL(file)
        const result = await cloudinary.uploader.upload(fileDataUrl, {
            resource_type: 'auto'
        })
        
        return result
    },
    async uploadMultiple(files: Express.Multer.File[]) {
        const uploadBatch = files.map((item) => {
            const result = this.uploadSingle(item)
            return result
        })
        const result = await Promise.all(uploadBatch)
        return result
    },
    async remove(fileUrl: string) {
        const publicId = getPublicIdFromFIleUrl(fileUrl)
        const result = await cloudinary.uploader.destroy(publicId)
        return result
    },
}