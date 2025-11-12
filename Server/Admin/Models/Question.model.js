import mongoose from "mongoose" 

const questionSchema = new mongoose.Schema({
    questionText : {
        type : String,
        required : true,
    },
    options : {
        type : [String],
        validate : [arr => arr.length === 4, "Must have exactly 4 options"],
        required : true,
    },
    correctOption : {
        type : Number,
        required : true ,
    },
    test : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'test',
        required : true,
    },
}, {timestamps : true}) ;
export const Question = mongoose.model('Question', questionSchema) ;