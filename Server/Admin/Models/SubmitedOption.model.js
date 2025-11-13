import mongoose from "mongoose" 

const submittedOptionSchema = new mongoose.Schema({
    contest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Test",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    submittedOption : {
        type : Number,
    },
    question : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Question",
    },
    autoDeleteAt : {
        type : Date,
        default : Date.now(),
        expires : 60 * 60 * 5 
    },
}, {timestamps : true}) ;

export const SubmittedOption = mongoose.model("SubmittedOption", submittedOptionSchema) ;