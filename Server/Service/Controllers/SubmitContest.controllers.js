import mongoose from "mongoose";
import { asynchandler, APIERR, APIRES } from "../../Utils/index.utils.js";
import { SubmittedOption } from "../../Admin/Models/SubmitedOption.model.js";
import { Test } from "../../Admin/Models/Contest.model.js";
import { Block } from "../../Admin/Models/BlockSchema.models.js";
import { MongoQueue } from "../../Admin/Models/SubmissionQuee.models.js";
import { cacheGet, cacheDelete } from "../../Utils/RedisCache.utils.js";

const submitContest = asynchandler(async (req, res) => {
  const { questions, contest, user, positionMap } = req.body;

  if (!contest || !user) {
    throw new APIERR(400, "Contest and user are required");
  }

  if (!Array.isArray(questions)) {
    throw new APIERR(400, "Questions array cannot be empty");
  }

  const contestDoc = await Test.findById(contest);
  if (!contestDoc) {
    throw new APIERR(404, "Contest not found");
  }

  const userId = new mongoose.Types.ObjectId(
    typeof user === "string" ? user : user._id
  );

  // Check if user is blocked before allowing submission
  const isBlocked = await Block.findOne({ blocked: userId });
  if (isBlocked) {
    throw new APIERR(403, "You are blocked from attempting contests");
  }

  // Mark contest active on first submission
  if (contestDoc.status === "pending") {
    contestDoc.status = "active";
  }

  if (!contestDoc.participants.includes(userId)) {
    contestDoc.participants.push(userId);
  }

  await contestDoc.save();

  // Prepare questions with shuffle information
  const preparedQuestions = questions.map((q) => ({
    question: new mongoose.Types.ObjectId(q.question),
    submittedOption: Number(q.submittedOption),
    checked: false,
  }));

  // Check if user already has a submission
  let submission = await SubmittedOption.findOne({
    contest: contestDoc._id,
    user: userId,
  });

  if (submission) {
    submission.questions = preparedQuestions;
    // Update position map if provided (for shuffled questions)
    if (positionMap) {
      submission.positionMap = positionMap;
    }
  } else {
    submission = new SubmittedOption({
      contest: contestDoc._id,
      user: userId,
      questions: preparedQuestions,
      positionMap: positionMap || {}, // Store shuffle mapping
      autoDeleteAt: new Date(Date.now() + 5 * 60 * 60 * 1000),
    });
  }

  await submission.save();

  // Add to processing queue
  await MongoQueue.create({
    type: "submission",
    payload: {
      submissionId: submission._id.toString(),
      contest: contestDoc._id.toString(),
      user: userId.toString(),
      positionMap: positionMap || {}, // Pass to worker for grading
    },
    maxAttempts: 3,
    attempts: 0,
    status: "pending",
    lockedAt: null,
  });

  // Clear user's cached questions (contest is now submitted)
  const userQuestionCacheKey = `contest:${contest}:user:${userId}:questions`;
  await cacheDelete(userQuestionCacheKey);

  return res
    .status(200)
    .json(
      new APIRES(
        200,
        { submission, contest: contestDoc },
        "Contest submitted successfully"
      )
    );
});

export { submitContest };
