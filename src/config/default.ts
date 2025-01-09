import dotenv from "dotenv"

dotenv.config()

export const APP_NAME = process.env.APP_NAME || "example"

export const MONGODB_URL =  process.env.MONGODB_URL 

export const SERVER_PORT = process.env.SERVER_PORT || 5000

export const LOG_ACCESS_FILE = process.env.LOG_ACCESS_FILE || 'logs/access.log'
export const LOG_ERROR_FILE = process.env.LOG_ERROR_FILE || 'logs/error.log'