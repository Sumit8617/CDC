import mongoose, { mongo } from "mongoose"

const testSchema = new mongoose.Schema({
    testName: {
        type: String,
        required: true,
    },
    desctiption : {
        type : String,
        required : true,
        maxChar : 250,
    },
    duration : {
        type : Number,
        required : true,
    },
    questions: [
        {
            type: mongoose.Schema.Type.ObjectId,
            ref : "Question" ,
            required : true,
        }
    ],

}, { timestamps: true }); 
export  const Test = mongoose.model("Test", testSchema) ;