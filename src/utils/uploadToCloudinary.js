import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs'



export const uploadToCloudinary = async (localFilePath) => {
    cloudinary.config({
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_SECRET,
    })
    try {
        if(!localFilePath) return null;
        const cldResponse = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto'
        });
        console.log(`File uploaded to cloudinary successfully`);
        fs.unlinkSync(localFilePath)  // this'll remove temporary saved file from local machine
        return cldResponse;
    } catch (error) {
        console.log('cloudinary error::',error)
        fs.unlinkSync(localFilePath)
        return null
    }
}
