import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
    question:{
        type:String,
        required:true,
    },
    options:[{
        type:String,
        required:true,
    }],
    correctAnswer:{
        type:String,
        required:true
    }
})

export const quizSchema = new mongoose.Schema(
    {
        title:{
            type:String,
            required:true,
            trim:true,
        },
        description:{
            type:String,
            trim:true,
        },
        questions:[questionSchema],
        createdBy:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true
        },
        isPublic:{
            type:Boolean,
            default:false,
        },
        isOfficial:{
            type:Boolean,
            default:false,
        },
        timeLimit:{
            type:Number,
            required:true,
            default:30,

        }
    },
    {timestamps:true}
)

const Quiz = mongoose.model("Quiz",quizSchema)
export default Quiz