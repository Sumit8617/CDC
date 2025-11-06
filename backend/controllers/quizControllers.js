import Quiz from "../models/quizModel.js"

export const createQuiz = async (req,res)=>{
    try {
        const {title,description,questions} =req.body
         if (!title || !questions || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ message: "Please provide quiz title and questions" });
    }
        
        const duplicateQuiz = await Quiz.findOne({
            title: { $regex: new RegExp(`^${title}$`, "i") },
            createdBy:req.user._id,
        })
        console.log("Duplicate Quiz  Run")

        if(duplicateQuiz){
            return res.status(400).json({ message: "You have already created a quiz with this title." })
        }

        const newQuiz = await Quiz.create({
            title,
            description,
            questions,
            // options,
            // correctAnswer,
            createdBy: req.user._id,
            // isPublic,
            // isOfficial,
            // timeLimit: timeLimit || 0 // Todo: will check later
        })   

        return res.status(201).json({message: "Quiz created successfully!",newQuiz});
    } catch (error) {
        console.log("Error in createQuiz Conroller",error)
        return res.status(400).json({message:"Internal Server error"})
    }
}

export const getAllQuiz = async (req,res)=>{
    const page = parseInt(req.query.page) || 1;
    const limit  = parseInt(req.query.limit) || 10;
    const skip = (page-1)*limit
    try {
        const quizzes  = await Quiz.find()
        .populate("createdBy","name email")
        .sort({createdAt:-1})
        .skip(skip)
        .limit(limit)

        if(!quizzes || quizzes.length===0){
            return res.status(400).json({message:"No Quiz found"})
        }
        const total = await Quiz.countDocuments()
        return res.status(200).json({
            message:"Quizzes fetched",
            total,                               
            page,                                
            totalPages: Math.ceil(total / limit), 
            quizzes})
    } catch (error) {
        console.log("Error in getAllQuiz Controller",error)
        return res.status(400).json({message:"Internal Server error"})
    }
}

export const getQuiz = async (req,res)=>{
    try {
        const {id} =req.params
        if(!id) return res.status(404).send({message:"Quiz id is required"})

        const quiz = await Quiz.findById(id).populate("createdBy", "name email").lean()
        if(!quiz) return res.status(400).json({message:"quiz not found"})

        return res.status(200).json({
            message:"quiz fetched successfully",
            quiz
        })   
    } catch (error) {
        console.log("Error in getQuiz Conroller",error)
        return res.status(400).json({message:"Internal Server error"})
    }    
}

export const deleteQuiz = async (req,res)=>{

    try {
        
        const {id} = req.params
        if(!id) return res.status(404).send({message:"Quiz id is required"})
            
        const quiz = await Quiz.findById(id)
        if(!quiz) return res.status(200).json({message:"quiz not found"})
                
        if(quiz.createdBy.toString()!==req.user._id.toString()){
            return res.status(400).json({message:"You are not authorized to delete this quiz."})
        }
        await quiz.deleteOne()
        return res.status(200).json({ message: "Quiz deleted successfully." });
    } catch (error) {
        console.log("Error in deleteQuiz Conroller",error)
        return res.status(400).json({message:"Internal Server error"})       
    }

}

export const getMyQuiz = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ createdBy: req.user._id })
      .sort({ createdAt: -1 });

    if(!quizzes || quizzes.length===0){
        return res.status(500).json({ message: "No quizzes found for this user." });
    }

    return res.status(200).json({
      message: "My quizzes fetched",
      quizzes,
    });
  } catch (error) {
    console.log("Error in getMyQuiz Controller", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateQuiz = async (req,res)=>{
    try {
        const {id} = req.params
        const {title,description,questions} = req.body

        if(!title && (!questions || questions.length === 0)){
            return res.status(400).json({message:"Please provide at least one field to update"})
        }
        if(!id) return res.status(404).send({message:"Quiz id is required"})

        const quiz = await Quiz.findById(id);
        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found." });
        }

        if (quiz.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "You are not authorized to update this quiz." });
        }

        const isTitleBeingChanged = title && title.trim().toLowerCase()!==quiz.title.trim().toLowerCase()
        
        if(isTitleBeingChanged){
            const existingQuiz = await Quiz.findOne({
            title: { $regex: new RegExp(`^${title}$`, "i") },
            createdBy: req.user._id,
            _id: { $ne: id },
            });
            if(existingQuiz){
                return res.status(400).json({message:"You already have another quiz with this title"})
            }

        }

        if(title) quiz.title=title.trim()
        if(description) quiz.description=description.trim()
        if(Array.isArray(questions)) quiz.questions=questions

        const updatedQuiz = await quiz.save()

        return res.status(200).json({
            message: "Quiz updated successfully.",
            quiz: updatedQuiz,
        })

    } catch (error) {
        console.log("Error in updateQuiz Conroller",error)
        return res.status(400).json({message:"Internal Server error"})
    }
}