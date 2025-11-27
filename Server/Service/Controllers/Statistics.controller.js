import { User } from "../Models/User.models.js";
import { Test } from "../../Admin/Models/Contest.model.js";
import { asynchandler, APIERR, APIRES } from "../../Utils/index.utils.js";

const getTotalUser = asynchandler(async (req, res) => {
  const totalUser = await User.find({}).countDocuments();
  console.log("Total User is =>", totalUser);
  res
    .status(200)
    .json(
      new APIRES(
        200,
        totalUser,
        "Successfully fetched the total number of users"
      )
    );
});

const getTotalContest = asynchandler(async (req, res) => {
  const totalContest = await Test.find({}).countDocuments();
  console.log("Total Number of Contest is =>", totalContest);
  res
    .status(200)
    .json(new APIRES(200, totalContest, "Total Contest fetched successfully"));
});

export { getTotalUser, getTotalContest };
