import mongoose, { mongo } from "mongoose"

const testSchema = new mongoose.Schema({
    testName: {
        type: String,
        required: true,
    },
    questions: [
        {
            type: mongoose.Schema.Type.ObjectId,
            ref : "Question" ,
            required : true,
        }
    ]

}, { timestamps: true });