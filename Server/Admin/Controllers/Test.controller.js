import {
  asynchandler,
  APIERR,
  APIRES,
  istToUtc,
} from "../../Utils/index.utils.js";
import { Test } from "../Models/Contest.model.js";
import { Question } from "../Models/Question.model.js";
import { invalidateCache, CACHE_KEYS } from "../../Utils/RedisCache.utils.js";
import { upload } from "../../Middleware/Multer.middleware.js";
import { parseQuestionFile } from "../../Utils/PdfParser.utils.js";
import fs from "fs";

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

  const contestDateUTC = istToUtc(contestDate, contestTime);

  if (contestDateUTC <= new Date()) {
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
        questionImage: q.questionImage || null,
      };
    })
  );

  const questionIds = createdQuestions.map((q) => q._id);

  // Save contest with IST date
  const newTest = await Test.create({
    testName: contestName,
    description,
    duration,
    date: contestDateUTC,
    questions: questionIds,
    status: "pending",
    isPublished: true,
  });

  // Invalidate contests cache after creating new contest
  await invalidateCache(`${CACHE_KEYS.CONTESTS}*`);
  await invalidateCache(`${CACHE_KEYS.UPCOMING_CONTESTS}*`);
  await invalidateCache(`${CACHE_KEYS.TEST_DETAILS}*`);

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

  const contestDateUTC = istToUtc(contestDate, contestTime);

  if (isNaN(contestDateUTC.getTime())) {
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
        questionImage: q.questionImage || null,
      };
    })
  );

  const questionIds = createdQuestions.map((q) => q._id);

  // Save as draft (status: draft)
  const draftContest = await Test.create({
    testName: contestName,
    description,
    duration,
    date: contestDateUTC,
    questions: questionIds,
    status: "draft",
    isDraft: true,
    isPublished: false,
  });

  // Invalidate cache
  await invalidateCache(`${CACHE_KEYS.CONTESTS}*`);

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

  const { contestDate, contestTime, ...rest } = req.body;

  if (contestDate && contestTime) {
    rest.date = istToUtc(contestDate, contestTime);
  }

  const updatedContest = await Test.findByIdAndUpdate(
    contestId,
    { $set: rest },
    { new: true }
  );

  // Invalidate cache after update
  await invalidateCache(`${CACHE_KEYS.CONTESTS}*`);
  await invalidateCache(`${CACHE_KEYS.UPCOMING_CONTESTS}*`);
  await invalidateCache(`${CACHE_KEYS.TEST_DETAILS}*`);
  await invalidateCache(`${CACHE_KEYS.QUESTION_DETAILS}${contestId}*`);

  return res
    .status(200)
    .json(new APIRES(200, "Contest updated successfully", { updatedContest }));
});

const deleteContest = asynchandler(async (req, res) => {
  const { contestId } = req.params;
  if (!contestId) throw new APIERR(404, "Contest ID is NOT FOUND");

  await Test.findByIdAndDelete(contestId);

  // Invalidate cache after deletion
  await invalidateCache(`${CACHE_KEYS.CONTESTS}*`);
  await invalidateCache(`${CACHE_KEYS.UPCOMING_CONTESTS}*`);
  await invalidateCache(`${CACHE_KEYS.TEST_DETAILS}*`);
  await invalidateCache(`${CACHE_KEYS.QUESTION_DETAILS}${contestId}*`);
  await invalidateCache(`${CACHE_KEYS.LEADERBOARD}${contestId}*`);

  return res.status(200).json(new APIRES(200, "Contest deleted successfully"));
});

// Parse questions from PDF/Word file
const parseQuestions = asynchandler(async (req, res) => {
  if (!req.file) {
    throw new APIERR(400, "Please upload a PDF or Word file");
  }

  const filePath = req.file.path;

  // Check if images were uploaded with the file
  let uploadedImages = [];
  if (req.files && req.files.images) {
    // Read each image and convert to base64
    for (const imageFile of req.files.images) {
      try {
        const imageBuffer = fs.readFileSync(imageFile.path);
        const base64 = imageBuffer.toString('base64');
        const mimeType = imageFile.mimetype;
        uploadedImages.push({
          url: `data:${mimeType};base64,${base64}`,
          type: mimeType,
          originalName: imageFile.originalname
        });

        // Clean up the image file after reading
        try {
          fs.unlinkSync(imageFile.path);
        } catch (e) {}
      } catch (e) {
        console.error("Error reading uploaded image:", e);
      }
    }
    console.log("Uploaded images count:", uploadedImages.length);
  }

  const result = await parseQuestionFile(filePath, uploadedImages);

  // Clean up the uploaded file
  try {
    fs.unlinkSync(filePath);
  } catch (err) {
    console.error("Error cleaning up file:", err);
  }

  if (!result.success) {
    throw new APIERR(400, result.message);
  }

  return res.status(200).json(
    new APIRES(200, result, "Questions extracted successfully")
  );
});

export {
  createTest,
  saveDraftContest,
  getContest,
  updateContest,
  deleteContest,
  parseQuestions,
};
