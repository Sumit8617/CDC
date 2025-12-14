import { asynchandler, APIERR, APIRES } from "../../Utils/index.utils.js";
import { Test } from "../Models/Contest.model.js";
import { Question } from "../Models/Question.model.js";

const createTest = asynchandler(async (req, res) => {
  const {
    contestName,
    description,
    contestDate,
    contestTime,
    duration,
    questions,
  } = req.body;

  // Basic validation
  if (
    [contestName, description, duration, contestDate, contestTime].some(
      (f) => !f || f.toString().trim() === ""
    )
  ) {
    throw new APIERR(400, "Please provide all required fields");
  }

  if (!Array.isArray(questions) || questions.length === 0) {
    throw new APIERR(400, "Please provide at least one question");
  }

  // Create date directly in IST (Kolkata timezone)
  const [hours, minutes] = contestTime.split(":").map(Number);
  const [year, month, day] = contestDate.split("-").map(Number);

  const contestDateIST = new Date(year, month - 1, day, hours, minutes);

  // Compare with current IST time
  const nowIST = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
  );

  if (contestDateIST <= nowIST) {
    throw new APIERR(400, "Contest time must be in the future");
  }

  // Create questions
  const createdQuestions = await Question.insertMany(
    questions.map((q, index) => {
      if (
        typeof q.correctOption !== "number" ||
        q.correctOption < 0 ||
        q.correctOption > 3
      ) {
        throw new APIERR(
          400,
          `Invalid correct option for question ${index + 1}`
        );
      }
      if (!Array.isArray(q.options) || q.options.length !== 4) {
        throw new APIERR(
          400,
          `Question ${index + 1} must have exactly 4 options`
        );
      }
      return {
        questionText: q.questionText,
        options: q.options,
        correctOption: q.correctOption,
      };
    })
  );

  const questionIds = createdQuestions.map((q) => q._id);

  // Save contest with IST date
  const newTest = await Test.create({
    testName: contestName,
    description,
    duration,
    date: contestDateIST,
    questions: questionIds,
    status: "pending",
    isPublished: true,
  });

  return res
    .status(201)
    .json(
      new APIRES(201, "Contest created successfully", { contest: newTest })
    );
});

const saveDraftContest = asynchandler(async (req, res) => {
  const {
    contestName,
    description,
    contestDate,
    contestTime,
    duration,
    questions,
  } = req.body;

  // Basic Validation
  if (
    [contestName, description, duration, contestDate, contestTime].some(
      (f) => !f || f.toString().trim() === ""
    )
  ) {
    throw new APIERR(400, "Please provide all required fields");
  }

  if (!Array.isArray(questions) || questions.length === 0) {
    throw new APIERR(400, "Please provide at least one question");
  }

  // Create contest date in IST
  const [hours, minutes] = contestTime.split(":").map(Number);
  const [year, month, day] = contestDate.split("-").map(Number);

  const contestDateTimeIST = new Date(year, month - 1, day, hours, minutes);

  if (isNaN(contestDateTimeIST.getTime())) {
    throw new APIERR(400, "Invalid contest date or time");
  }

  // Create Questions
  const createdQuestions = await Question.insertMany(
    questions.map((q, index) => {
      if (
        typeof q.correctOption !== "number" ||
        q.correctOption < 0 ||
        q.correctOption > 3
      ) {
        throw new APIERR(
          400,
          `Invalid correct option for question ${index + 1}`
        );
      }

      if (!Array.isArray(q.options) || q.options.length !== 4) {
        throw new APIERR(
          400,
          `Question ${index + 1} must have exactly 4 options`
        );
      }

      return {
        questionText: q.questionText,
        options: q.options,
        correctOption: q.correctOption,
      };
    })
  );

  const questionIds = createdQuestions.map((q) => q._id);

  // Save as draft (status: draft)
  const draftContest = await Test.create({
    testName: contestName,
    description,
    duration,
    date: contestDateTimeIST,
    questions: questionIds,
    status: "draft",
    isDraft: true,
    isPublished: false,
  });

  return res.status(201).json(
    new APIRES(201, "Contest saved as draft successfully", {
      contest: draftContest,
    })
  );
});

const getContest = asynchandler(async (req, res) => {
  const totalContests = await Test.countDocuments();
  const contestDetails = await Test.find({ isDraft: true }).populate(
    "questions"
  );

  return res.status(200).json(
    new APIRES(
      200,
      {
        totalContests,
        contestDetails,
      },
      "Contest details fetched successfully"
    )
  );
});

const updateContest = asynchandler(async (req, res) => {
  const { contestId } = req.params;
  if (!contestId) throw new APIERR(404, "Contest ID is NOT FOUND");
  const updatedContest = await Test.findByIdAndUpdate(
    contestId,
    { $set: req.body },
    { new: true }
  );
  return res
    .status(200)
    .json(new APIRES(200, "Contest updated successfully", { updatedContest }));
});

const deleteContest = asynchandler(async (req, res) => {
  const { contestId } = req.params;
  if (!contestId) throw new APIERR(404, "Contest ID is NOT FOUND");
  await Test.findByIdAndDelete(contestId);
  return res.status(200).json(new APIRES(200, "Contest deleted successfully"));
});

export {
  createTest,
  saveDraftContest,
  getContest,
  updateContest,
  deleteContest,
};
