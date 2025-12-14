import { asynchandler, APIERR, APIRES } from "../../Utils/index.utils.js";
import { Test } from "../../Admin/Models/Contest.model.js";

const getUpcomingContests = asynchandler(async (req, res) => {
  try {
    // ALWAYS use UTC for calculations
    const now = new Date();

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

          // Show questions ONLY when active
          questions: status === "active" ? contest.questions : [],
        };
      })
    );
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

export { getUpcomingContests };
