import multer from "multer";
import path from "path";
import { v2 as cloudinary } from 'cloudinary';
import config from "../config";
import fs from 'fs';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), '/uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

async function uploadToCloudinary(file: Express.Multer.File) {
  // Configuration
  cloudinary.config({
    cloud_name: config.cloudinary.cloud_name,
    api_key: config.cloudinary.api_key,
    api_secret: config.cloudinary.api_secret
  });

  // Upload with resource_type 'auto' so non-image files (pdf, video, etc.) are accepted
  try {
    const uploadResult = await cloudinary.uploader.upload(file.path, {
      public_id: `${file.originalname}-${Date.now()}`,
      resource_type: 'auto'
    });

    return uploadResult;
  } catch (error) {
    throw error;
  } finally {
    try {
      if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
    } catch (e) {
      // swallow unlink errors
    }
  }

  // // Optimize delivery by resizing and applying auto-format and auto-quality
  // const optimizeUrl = cloudinary.url(`${uploadResult?.public_id}`, {
  //     fetch_format: 'auto',
  //     quality: 'auto'
  // });

  // console.log(optimizeUrl);

  // // Transform the image: auto-crop to square aspect_ratio
  // const autoCropUrl = cloudinary.url(`${uploadResult?.public_id}`, {
  //     crop: 'auto',
  //     gravity: 'auto',
  //     width: 500,
  //     height: 500,
  // });

  // console.log(autoCropUrl);    
};

const upload = multer({ storage: storage });

export const fileUploader = {
  upload,
  uploadToCloudinary
};