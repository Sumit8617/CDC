import mongoose from "mongoose";
 
export const connDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI)
        console.log(`MongoDB connectted ${conn.connection.host}`)
    } catch (error) {
        console.log("Error in MongoDB connection",error)
    }
}