import { v2 as cloudinary } from "cloudinary"; // import cloudinary v2

import { config } from "dotenv";

config();

cloudinary.config({
  // here we are configuring cloudinary with env variables
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;
