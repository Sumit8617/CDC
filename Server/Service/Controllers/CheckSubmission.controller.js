import { asynchandler, APIERR, APIRES } from "../../Utils/index.utils.js";
import { SubmittedOption } from "../../Admin/Models/SubmitedOption.model.js";

const checkUserSubmission = asynchandler(async (req, res) => {
  const userId = req.user._id;
  const { contestId } = req.params;

  if (!contestId) {
    throw new APIERR(400, "Contest ID is required");
  }

  const submission = await SubmittedOption.findOne({
    contest: contestId,
    user: userId,
  });

  const hasSubmitted = !!submission;

  return res.status(200).json(
    new APIRES(
      200,
      { hasSubmitted, submissionId: submission?._id },
      hasSubmitted ? "User has already submitted this contest" : "User has not submitted this contest"
    )
  );
});

export { checkUserSubmission };