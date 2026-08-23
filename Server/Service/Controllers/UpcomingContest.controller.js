import { asynchandler, APIERR, APIRES } from "../../Utils/index.utils.js";
import { Test } from "../../Admin/Models/Contest.model.js";
import { Question } from "../../Admin/Models/Question.model.js";
import { Block } from "../../Admin/Models/BlockSchema.models.js";
import { cachedFetch, cacheDelete, invalidateCache, CACHE_KEYS, CACHE_TTL, cacheSet, cacheGet } from "../../Utils/RedisCache.utils.js";
import { shuffleForUser } from "../../Utils/QuestionShuffle.utils.js";

const getUpcomingContests = asynchandler(async (req, res) => {
  try {
    const cacheKey = `${CACHE_KEYS.UPCOMING_CONTESTS}:v1`;

    // ALWAYS use UTC for calculations
    const now = new Date();

    const fetchContests = async () => {
      const contests = await Test.find({
        isPublished: true,
        status: { $in: ["pending", "active"] },
      })
        .sort({ date: 1 })
        .populate("questions");

      const contestsWithDetails = await Promise.all(
        contests.map(async (contest) => {
          const startTime = new Date(contest.date); // UTC
          const endTime = new Date(
            startTime.getTime() + contest.duration * 60000
          );

          let status = "pending";
          let remainingTime = null;

          if (now >= startTime && now <= endTime) {
            // Contest is ACTIVE
            status = "active";
            remainingTime = endTime - now;
          } else if (now > endTime) {
            // Contest is COMPLETED
            status = "completed";
            remainingTime = 0;
          }

          // Update DB only if status actually changed
          if (contest.status !== status) {
            contest.status = status;
            await contest.save();
          }

          return {
            _id: contest._id,
            title: contest.testName,

            // Convert to IST ONLY for display
            startDate: new Date(startTime.getTime() + 5.5 * 60 * 60 * 1000),
            duration: contest.duration,
            status,

            // Show remainingTime ONLY when active
            remainingTime: status === "active" ? remainingTime : null,

            // Don't show questions here - they'll be fetched separately with shuffle
            questions: [],
          };
        })
      );

      return contestsWithDetails;
    };

    const contestsWithDetails = await cachedFetch(cacheKey, fetchContests, CACHE_TTL.UPCOMING_CONTESTS);

    console.log(
      "Contest Start Date (IST):",
      contestsWithDetails.map((c) => c.startDate)
    );

    return res
      .status(200)
      .json(
        new APIRES(
          200,
          contestsWithDetails,
          "Upcoming contests fetched successfully"
        )
      );
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json(new APIERR(500, "Failed to fetch upcoming contests"));
  }
});

// Get shuffled questions for a specific user (called when contest starts)
const getShuffledQuestions = asynchandler(async (req, res) => {
  const { contestId } = req.params;
  const userId = req.user?._id;

  if (!contestId) {
    throw new APIERR(400, "Contest ID is required");
  }

  if (!userId) {
    throw new APIERR(401, "User authentication required");
  }

  // Check if user is blocked
  const isBlocked = await Block.findOne({ blocked: userId });
  if (isBlocked) {
    throw new APIERR(403, "You are blocked from attempting contests");
  }

  // Check if user already has shuffled questions cached
  const userQuestionCacheKey = `contest:${contestId}:user:${userId}:questions`;
  const cachedQuestions = await cacheGet(userQuestionCacheKey);

  if (cachedQuestions) {
    console.log(`Serving cached shuffled questions for user ${userId}`);
    return res.status(200).json(
      new APIRES(200, cachedQuestions, "Questions fetched from cache")
    );
  }

  // Fetch contest with questions
  const contest = await Test.findById(contestId)
    .populate("questions")
    .lean();

  if (!contest) {
    throw new APIERR(404, "Contest not found");
  }

  if (!contest.questions || contest.questions.length === 0) {
    throw new APIERR(404, "No questions found for this contest");
  }

  // Check contest timing
  const now = new Date();
  const startTime = new Date(contest.date);
  const endTime = new Date(startTime.getTime() + contest.duration * 60000);

  if (now < startTime) {
    throw new APIERR(400, "Contest has not started yet");
  }

  if (now > endTime) {
    throw new APIERR(400, "Contest has ended");
  }

  // Shuffle questions uniquely for this user
  const shuffledData = shuffleForUser(contest.questions, userId.toString());

  // Remove correct answers from questions (for security - NEVER send to client)
  const questionsWithoutAnswers = shuffledData.questions.map(q => ({
    _id: q._id,
    questionText: q.questionText,
    options: q.options,
    questionImage: q.questionImage || null,
    // DO NOT include correctOption - this is critical for anti-cheating!
  }));

  // Prepare response for client (WITHOUT positionMap for security)
  const clientResponseData = {
    contestId: contest._id,
    contestName: contest.testName,
    duration: contest.duration,
    questions: questionsWithoutAnswers,
    totalQuestions: shuffledData.originalCount,
    shuffledAt: shuffledData.shuffledAt
  };

  // Store grading data separately in Redis (NOT sent to client)
  const gradingDataKey = `contest:${contestId}:user:${userId}:grading`;
  const gradingData = {
    positionMap: shuffledData.positionMap,
    contestId: contest._id.toString(),
    userId: userId.toString(),
    shuffledAt: shuffledData.shuffledAt
  };

  // Cache shuffled questions for this user (with contest duration TTL)
  const cacheTTL = contest.duration * 60; // Convert minutes to seconds
  await cacheSet(userQuestionCacheKey, clientResponseData, cacheTTL);
  await cacheSet(gradingDataKey, gradingData, cacheTTL);

  console.log(`Shuffled questions for user ${userId}: ${shuffledData.originalCount} questions`);

  return res.status(200).json(
    new APIRES(200, clientResponseData, "Questions fetched and shuffled")
  );
});

export { getUpcomingContests, getShuffledQuestions };
