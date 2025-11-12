import mongoose from "mongoose" 

const submitedOptionSchema = new mongoose.Schema({
    submitedOption : {
        type : Number,
    },
    question : {
        type : mongoose.Schema.Type.ObjectId,
        ref : "Question",
    },
    createdAt : {
        type : Date,
        default : Date.now(),
        expires : 60 * 60 * 5000 
    },
}, {timestamps : true}) ;

export const SubmittedOption = mongoose.model("SubmittedOption", submitedOptionSchema) ;