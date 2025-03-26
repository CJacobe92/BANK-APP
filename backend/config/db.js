import mongoose from "mongoose";

export const ConnectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`MongoDB connected: ${conn.connection.host}`)
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(0) // process code 1 means exit with failure, process code 0 means success
    }
}