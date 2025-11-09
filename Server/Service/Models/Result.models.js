import mongoose from "mongoose";

const resultSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    quizId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Quiz",
        required:true
    },
    answers:[{
        questionIndex:Number,
        selctedOption:String,
    }],
    totalQuestions: {
        type: Number,
        required: true
    },
    score:{
        type:Number,
        required:true
    },
    timeTaken:{
        type:Number,
        default:0,
    },
    submittedAt:{
        type:Date,
        default:Date.now
    },
    
},{ timestamps:true })

const Result = mongoose.model("Result",resultSchema)
export default Result