import { APIERR,APIRES, asynchandler } from "../../Utils/index.utils.js"
import { Question } from "../Models/Question.model.js";
import { SubmittedOption } from "../Models/SubmitedOption.model.js";

let score = 0 ;
export const checkingCorrectness = asynchandler (async(req , res) => {
    
    const clickedOption = await SubmittedOption.findOne({SubmittedOption}) ;
    const questionId = await SubmittedOption.findById({question}) ;
    const fetchedCorrectOption = questionId.correctOption ;
    if(fetchedCorrectOption === clickedOption ) {
        score++;
    }
}) ;