import { asynchandler, APIERR, APIRES } from "../../Utils/index.utils.js";
import { Test } from "../../Admin/Models/Contest.model.js";

const getUpcomingContests = asynchandler(async (req, res) => {
  try {
    // Current IST time
    const nowIST = new Date(
      new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
    );

    const contests = await Test.find({
      isPublished: true,
      status: { $in: ["pending", "active"] },
    })
      .sort({ date: 1 })
      .populate("questions");
    console.log("Fetched Contests =>", contests);

    const contestsWithDetails = await Promise.all(
      contests.map(async (contest) => {
        const startTimeIST = new Date(contest.date);
        const endTimeIST = new Date(
          startTimeIST.getTime() + contest.duration * 60000
        );

        let status, remainingTime;

        if (nowIST < startTimeIST) {
          status = "pending";
          remainingTime = startTimeIST - nowIST; // time until start
        } else if (nowIST >= startTimeIST && nowIST <= endTimeIST) {
          status = "active";
          remainingTime = endTimeIST - nowIST; // time until end
        } else {
          status = "completed";
          remainingTime = 0;
        }

        // Update DB status if changed
        if (contest.status !== status) {
          contest.status = status;
          await contest.save();
        }

        return {
          _id: contest._id,
          title: contest.testName,
          startDate: startTimeIST, // IST
          duration: contest.duration,
          remainingTime,
          status,
          questions: status === "active" ? contest.questions : [],
        };
      })
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
