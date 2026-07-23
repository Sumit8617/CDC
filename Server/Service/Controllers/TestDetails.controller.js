import { asynchandler, APIERR, APIRES } from "../../Utils/index.utils.js";
import { Test } from "../../Admin/Models/Contest.model.js";
import { Question } from "../../Admin/Models/Question.model.js";
import { cachedFetch, CACHE_KEYS, CACHE_TTL } from "../../Utils/RedisCache.utils.js";

const fetchContestDetails = asynchandler(async (req, res) => {
  const cacheKey = `${CACHE_KEYS.TEST_DETAILS}all:v1`;

  const fetchDetails = async () => {
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

    return {
      formattedContests,
      totalContest: formattedContests.length,
    };
  };

  const cachedData = await cachedFetch(cacheKey, fetchDetails, CACHE_TTL.TEST_DETAILS);

  return res.status(200).json(
    new APIRES(
      200,
      cachedData,
      cachedData.formattedContests.length === 0
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

  const cacheKey = `${CACHE_KEYS.QUESTION_DETAILS}${contestId}:v1`;

  const fetchQuestions = async () => {
    const questionDetails = await Test.findById(contestId)
      .populate("questions")
      .lean();

    if (!questionDetails) {
      throw new APIERR(404, "Questions not found");
    }
    return questionDetails;
  };

  const questionDetails = await cachedFetch(cacheKey, fetchQuestions, CACHE_TTL.QUESTION_DETAILS);

  res
    .status(200)
    .json(
      new APIRES(
        200,
        questionDetails,
        "Successfully fetched the Questions Details"
      )
    );
});

export { fetchContestDetails, fetchPreviousQuestions };
