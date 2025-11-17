import { asynchandler, APIERR, APIRES } from "../../Utils/index.utils.js";
import { Test } from "../Models/Test.model.js";
import { Question } from "../Models/Question.model.js";

export const createTest = asynchandler(async (req, res) => {
  const { testName, description, duration, questions } = req.body;

  // Basic validation
//   if ([testName, description, duration].some((f) => !f || f.trim() === "")) {
//     throw new APIERR(400, "Please provide all required fields");
//   }

  if (!Array.isArray(questions) || questions.length === 0) {
    throw new APIERR(400, "Please provide at least one question");
  }

  // Step 1: Create each question and associate them with the test
  const createdQuestions = await Question.insertMany(
    questions.map((q) => ({
      ...q,
      correctOption: parseInt(q.correctOption),
    }))
  );

  // Step 2: Extract their IDs
  const questionIds = createdQuestions.map((q) => q._id);

  // Step 3: Create the test and link the questions
  const newTest = await Test.create({
    testName,
    description,
    duration,
    questions: questionIds,
  });

  return res
    .status(201)
    .json(new APIRES(201, "Test created successfully", { newTest }));
});