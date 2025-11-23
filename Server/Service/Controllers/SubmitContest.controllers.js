import mongoose from "mongoose";
import { asynchandler, APIERR, APIRES } from "../../Utils/index.utils.js";
import { SubmittedOption } from "../../Admin/Models/SubmitedOption.model.js";
import { Test } from "../../Admin/Models/Contest.model.js";
import { MongoQueue } from "../../Admin/Models/SubmissionQuee.models.js";

const submitContest = asynchandler(async (req, res) => {
  const { questions, contest, user } = req.body;
  // Validation
  if (!contest || !user) {
    return res
      .status(400)
      .json(new APIERR(400, "Contest and user are required"));
  }

  if (!questions || !Array.isArray(questions) || questions.length === 0) {
    return res
      .status(400)
      .json(new APIERR(400, "Questions array cannot be empty"));
  }

  // Check that is the contest exist ?
  const contestDoc = await Test.findById(contest);
  if (!contestDoc) {
    return res.status(404).json(new APIERR(404, "Contest not found"));
  }

  // Verify contest time is valid
  const contestEnd = new Date(
    contestDoc.date.getTime() + contestDoc.duration * 60 * 1000
  );

  if (isNaN(contestEnd)) {
    return res
      .status(500)
      .json(new APIERR(500, "Error calculating contest end time"));
  }

  // UPSERT SUBMISSION (safe)
  let submission = await SubmittedOption.findOne({ contest, user });

const preparedQuestions = questions.map((q) => ({
  question: new mongoose.mongo.ObjectId(q.question),
  submittedOption: Number(q.submittedOption),
  checked: false,
}));



  // If submission exists → update
  if (submission) {
    submission.questions = preparedQuestions;
  } else {
    submission = new SubmittedOption({
      contest,
      user,
      questions: preparedQuestions,
      autoDeleteAt: new Date(Date.now() + 5 * 60 * 60 * 1000), // TTL 5 hours
    });
  }

  // Save submission FIRST — guaranteed before queue job is created
  await submission.save();

  // PUSH TO QUEUE (Race Safe)
  await MongoQueue.create({
    type: "submission",
    payload: {
      submissionId: submission._id.toString(),
      contest: contest.toString(),
      user: user.toString(),
    },
    maxAttempts: 3,
    status: "pending",
    lockedAt: null,
  });

  console.log("✔ Submission Saved:", submission._id);

  return res
    .status(200)
    .json(new APIRES(200, submission, "Successfully Submitted"));
});

export { submitContest };
