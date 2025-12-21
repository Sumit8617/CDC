import mongoose from "mongoose";
import { asynchandler, APIERR, APIRES } from "../../Utils/index.utils.js";
import { SubmittedOption } from "../../Admin/Models/SubmitedOption.model.js";
import { Test } from "../../Admin/Models/Contest.model.js";
import { MongoQueue } from "../../Admin/Models/SubmissionQuee.models.js";

const submitContest = asynchandler(async (req, res) => {
  const { questions, contest, user } = req.body;

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

  // Mark contest active on first submission
  if (contestDoc.status === "pending") {
    contestDoc.status = "active";
  }

  if (!contestDoc.participants.includes(userId)) {
    contestDoc.participants.push(userId);
  }

  await contestDoc.save();

  const preparedQuestions = questions.map((q) => ({
    question: new mongoose.Types.ObjectId(q.question),
    submittedOption: Number(q.submittedOption),
    checked: false,
  }));

  let submission = await SubmittedOption.findOne({
    contest: contestDoc._id,
    user: userId,
  });

  if (submission) {
    submission.questions = preparedQuestions;
  } else {
    submission = new SubmittedOption({
      contest: contestDoc._id,
      user: userId,
      questions: preparedQuestions,
      autoDeleteAt: new Date(Date.now() + 5 * 60 * 60 * 1000),
    });
  }

  await submission.save();

  await MongoQueue.create({
    type: "submission",
    payload: {
      submissionId: submission._id.toString(),
      contest: contestDoc._id.toString(),
      user: userId.toString(),
    },
    maxAttempts: 3,
    attempts: 0,
    status: "pending",
    lockedAt: null,
  });

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
