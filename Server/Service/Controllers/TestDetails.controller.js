import { asynchandler, APIERR, APIRES } from "../../Utils/index.utils.js";
import { Test } from "../../Admin/Models/Contest.model.js";

const fetchContestDetails = asynchandler(async (req, res) => {
  const contests = await Test.find({ status: "completed" })
    .sort({ createdAt: -1 })
    .select("testName date status description")
    .lean();

  const formattedContests = contests.map((contest) => ({
    contestId: contest._id,
    contestName: contest.testName,
    contestDate: contest.date.toISOString().split("T")[0],
    contestStatus: contest.status,
    contestDescription: contest.description,
  }));

  return res.status(200).json(
    new APIRES(
      200,
      {
        formattedContests,
        totalContest: formattedContests.length,
      },
      formattedContests.length === 0
        ? "No contests available"
        : "Successfully fetched contest details"
    )
  );
});

const fetchPreviousQuestions = asynchandler(async (req, res) => {
  const contestId = req.params.id;
  if (!contestId) {
    throw new APIERR(404, "Contest ID Not Found");
  }
  const questionDeatils = await Test.findById(contestId)
    .populate("questions")
    .lean();
  if (!questionDeatils) {
    throw new APIERR(404, "Questions not found");
  }

  res
    .status(200)
    .json(
      new APIRES(
        200,
        questionDeatils,
        "Successfully fetched the Questions Details"
      )
    );
});

export { fetchContestDetails, fetchPreviousQuestions };
