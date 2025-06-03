import dotenv from 'dotenv';

dotenv.config();

// set database
export const DATABASE_URL: string = process.env.DATABASE_URL || "";

export const SECRET: string = process.env.SECRET || "";

// set email validation
export const EMAIL_SMPT_SECURE: boolean = Boolean(process.env.EMAIL_SMPT_SECURE) || false

export const EMAIL_SMPT_PASS: string = process.env.EMAIL_SMPT_PASS || ""

export const EMAIL_SMPT_USER: string = process.env.EMAIL_SMPT_USER || ""

export const EMAIL_SMPT_PORT: number = Number(process.env.EMAIL_SMPT_PORT) || 465

export const EMAIL_SMPT_HOST: string = process.env.EMAIL_SMPT_HOST || ""

export const EMAIL_SMPT_SERVICE_NAME: string = process.env.EMAIL_SMPT_SERVICE_NAME || ""

// back-end base url
export const CLIENT_HOST: string = process.env.CLIENT_HOST || "http://localhost:3001"

// set cloudinary
export const CLOUDINARY_CLOUD_NAME: string = process.env.CLOUDINARY_CLOUD_NAME || ""

export const CLOUDINARY_API_KEY: string = process.env.CLOUDINARY_API_KEY || ""

export const CLOUDINARY_API_SECRET: string = process.env.CLOUDINARY_API_SECRET || ""

// set midtrans
export const MIDTRANS_CLIENT_KEY = process.env.MIDTRANS_CLIENT_KEY || "";

export const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY || "";

export const MIDTRANS_TRANSACTION_URL =
  process.env.MIDTRANS_TRANSACTION_URL || "";




