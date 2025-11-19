import { asynchandler, APIERR, APIRES } from "../../Utils/index.utils.js";
import { SubmittedOption } from "../../Admin/Models/SubmitedOption.model.js";
import { Test } from "../../Admin/Models/Contest.model.js";

const submitContest = asynchandler(async (req, res) => {
  const { questions, contest, user } = req.body;

  // Basic validation
  if (
    !questions ||
    !Array.isArray(questions) ||
    !questions.length ||
    !contest ||
    !user
  ) {
    return res
      .status(400)
      .json(
        new APIERR(400, "Missing required fields or questions array is empty")
      );
  }

  // Fetch the contest document
  const contestDoc = await Test.findById(contest);
  if (!contestDoc)
    return res.status(404).json(new APIERR(404, "Contest not found"));

  // Calculate contest end time + 5 minutes
  const contestEndTime = new Date(
    contestDoc.date.getTime() + contestDoc.duration * 60 * 1000
  );
  if (!contestEndTime)
    return res
      .status(500)
      .json(new APIERR(500, "Cannot calculate contest end time"));

  // Check if a submission already exists for this user and contest
  let submission = await SubmittedOption.findOne({ contest, user });
  if (submission) {
    // Update existing submission with new questions (or overwrite)
    submission.questions = questions.map((q) => ({
      question: q.question,
      submittedOption: Number(q.submittedOption),
      checked: false,
    }));
  } else {
    // Create new submission
    submission = new SubmittedOption({
      contest,
      user,
      questions: questions.map((q) => ({
        question: q.question,
        submittedOption: Number(q.submittedOption),
        checked: false,
      })),
      autoDeleteAt: new Date(Date.now() + 5 * 60 * 60 * 1000), // optional, 5 hours expiry
    });
  }

  await submission.save();

  console.log("Successfully Submitted", submission);
  res.status(200).json(new APIRES(200, submission, "Successfully Submitted"));
});

export { submitContest };
