import { APIERR, APIRES, asynchandler } from "../../Utils/index.utils.js";
import { SubmittedOption } from "../Models/SubmitedOption.model.js";
import { Question } from "../Models/Question.model.js";
import { User } from "../../Service/Models/User.models.js";

export const checkingCorrectness = asynchandler(async (req, res) => {
  const { submitedOption, question, userId } = req.body;

  // Validate input
  if (submitedOption === undefined || !question) {
    throw new APIERR(400, "Please provide both submitedOption and question ID");
  }

 
  const submission = await SubmittedOption.create({
    submitedOption,
    question,
  });

  console.log("Successfully Submitted =>", submission);

  //  Fetch the related question to check correctness
  const fetchedQuestion = await Question.findById(question);
  if (!fetchedQuestion) throw new APIERR(404, "Question not found");

  // Compare user's answer with the correct one
  const isCorrect =
    Number(submitedOption) === Number(fetchedQuestion.correctOption);
  const score = isCorrect ? 5 : 0;
  let updatedScore = 0;
  if (isCorrect) {
    const user = await User.findById(userId);
    if (!user) throw new APIERR(404, "User not found");

    user.score += 5;
    await user.save();
    updatedScore = user.score;
    console.log("Updated Score =>", updatedScore);
  }
  // Respond with result
  return res.status(200).json(
    new APIRES(
      200,
      {
        isCorrect,
        score,
        question: fetchedQuestion._id,
        submissionId: submission._id,
      },
      "Answer checked successfully"
    )
  );
});
