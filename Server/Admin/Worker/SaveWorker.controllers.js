import { SubmittedOption } from "../Models/SubmitedOption.model.js";
import { Question } from "../Models/Question.model.js";
import Result from "../../Service/Models/Result.models.js";
import { Test } from "../Models/Contest.model.js";

export async function processSubmissionJob(job) {
  try {
    console.log("➡ Processing job:", job._id);

    const { submissionId } = job.payload;

    let submission = null;

    for (let i = 0; i < 5; i++) {
      submission = await SubmittedOption.findById(submissionId);
      if (submission) break;
      await new Promise((r) => setTimeout(r, 200));
    }

    if (!submission) {
      throw new Error("Submission not found");
    }

    // Fetch all question IDs from the submission
    const questionIds = submission.questions.map((q) => q.question);

    // Bulk fetch correct options from Question model
    const questions = await Question.find({
      _id: { $in: questionIds },
    }).select("_id correctOption");

    const correctOptionMap = {};
    questions.forEach((q) => {
      correctOptionMap[q._id.toString()] = q.correctOption;
    });

    // Check each answer and mark correct/incorrect
    let score = 0;
    const checkedQuestions = submission.questions.map((q) => {
      const questionIdStr = q.question.toString();
      const correctOption = correctOptionMap[questionIdStr];
      const isCorrect =
        correctOption !== undefined &&
        Number(q.submittedOption) === Number(correctOption);

      if (isCorrect) {
        score += 5;
      }

      return {
        ...q.toObject(),
        checked: true,
        isCorrect,
      };
    });

    // Update submission with checked questions and score
    submission.questions = checkedQuestions;
    submission.score = score;
    await submission.save();

    // Also save to Result model for user dashboard stats
    const contest = await Test.findById(submission.contest);
    if (contest) {
      await Result.findOneAndUpdate(
        { userId: submission.user, quizId: contest._id },
        {
          userId: submission.user,
          quizId: contest._id,
          answers: submission.questions.map((q, idx) => ({
            questionIndex: idx,
            selectedOption: q.submittedOption,
          })),
          totalQuestions: contest.questions.length,
          score: score,
          timeTaken: 0,
          submittedAt: new Date(),
        },
        { upsert: true, new: true }
      );
    }

    job.status = "completed";
    job.lockedAt = null;
    await job.save();

    console.log(`✔ Submission checked: ${submissionId}, score: ${score}`);
  } catch (err) {
    job.attempts += 1;

    if (job.attempts >= job.maxAttempts) {
      job.status = "failed";
      job.error = err.message;
      console.error("❌ Job failed:", job._id);
    } else {
      job.status = "pending";
      job.lockedAt = null;
      console.log("🔁 Retrying job:", job._id);
    }

    await job.save();
  }
}
