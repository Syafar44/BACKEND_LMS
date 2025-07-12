import dotenv from 'dotenv';

dotenv.config();

export const DATABASE_URL: string = process.env.DATABASE_URL || "";

export const SECRET: string = process.env.SECRET || "";

// set cloudinary
export const CLOUDINARY_CLOUD_NAME: string = process.env.CLOUDINARY_CLOUD_NAME || ""

export const CLOUDINARY_API_KEY: string = process.env.CLOUDINARY_API_KEY || ""

export const CLOUDINARY_API_SECRET: string = process.env.CLOUDINARY_API_SECRET || ""