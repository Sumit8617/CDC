import Result from "../models/resultModel.js";
import Quiz from "../models/quizModel.js";
import {User} from "../models/userModel.js";

export const submitResult = async (req,res) =>{
    try {
        const {quizId} = req.params;
        const {answers,timeTaken} = req.body;
        
        if (!answers) return res.status(400).json({ message: "Answers are required" });
        
        const quiz = await Quiz.findById(quizId)
        if(!quiz) return res.status(404).json({message:"Quiz not found"})
            
            if(quiz.isOfficial){
                const existingResult = await Result.findOne({quizId,userId:req.user._id})
                if(existingResult){
                    return res.status(400).json({message:"You have already submitted this quiz"})
                }
            }
            
            let score =0;
            quiz.questions.forEach((q,i) => {
                if(q.correctAnswer===answers[i]?.selectedOption){
                    score+=1
                }
            });
            
            const newResult = await Result.create({
                quizId,
                userId:req.user._id,
                score,
                totalQuestions:quiz.questions.length,
                submittedAt:Date.now(),
                timeTaken,
                isOfficial:quiz.isOfficial || false,
            })
            return res.status(201).json({message:"Quiz submitted successfully",result:newResult})
            
        } catch (error) {
            console.log("Error in submitResult controller",error)
            return res.status(500).json({message:"Internal Server error"})
        }
    }

export const getMyResult = async (req,res) =>{
    try {
        const {quizId} = req.params;
        if(!quizId){
            return res.status(400).json({message:"Quiz id is required"})
        }
        const result = await Result.findOne({quizId,isOfficial:true})
            .sort({ submittedAt: 1 })
            .lean();
        if(!result || result.length===0){
            return res.status(404).json({message:"No attempt found"})
        }
        return res.status(200).json({message:"Result fetched successfully",result})
    } catch (error) {
        console.log("Error in getMyResult controller",error)
        return res.status(500).json({message:"Internal Server error"})
    }
}

export const getLeaderboard = async (req,res) =>{
    try {
        const {quizId} = req.params;
        if(!quizId){
            return res.status(400).json({message:"Quiz id is required"})
        }   
        const allResults = await Result.find({quizId})
         
        if(!allResults || allResults.length===0){
            return res.status(404).json({message:"No attempts found for this quiz"})
        }   

        const firstAttemptMap = new Map();
        allResults.forEach(r=>{
            const key = r.userId.toString();
            if(!firstAttemptMap.has(key)){
                firstAttemptMap.set(key,r)
            }
        })

        let leaderboard = Array.from(firstAttemptMap.values());

        const userIds = leaderboard.map(r => r.userId);
        const users = await User.find({ _id: { $in: userIds } }).select("name email");

    // Merge user info into leaderboard
        leaderboard = leaderboard.map(entry => {
        const user = users.find(u => u._id.toString() === entry.userId.toString());
        return {
            userId: entry.userId,
            name: user?.name || "Unknown",
            email: user?.email || "Hidden",
            score: entry.score,
            timeTaken: entry.timeTaken,
            submittedAt: entry.submittedAt,
        };
        });

        leaderboard.sort((a, b) => {
            if (b.score !== a.score) return b.score - a.score;
            return new Date(a.submittedAt) - new Date(b.submittedAt);
        });


        return res.status(200).json({message:"Leaderboard fetched successfully",leaderboard})
    } catch (error) {
        console.log("Error in getLeaderboard controller",error)
        return res.status(500).json({message:"Internal Server error"})
    }
}