import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../lib/UserAuthSlice";
import adminStatsReducer from "../lib/StatsSlice";
import contestDeatilsReducer from "../lib/TestSlice";
import forgotPasswordReducer from "../lib/ForgotPasswordSlice";
import adminInviteReducer from "../lib/Admin/AdminSlice";
import verifyAdminInviteReducer from "../lib/Admin/VerifyAdminSlice";
import registerAdminReducer from "../lib/Admin/RegisterAdmin";
import ManageContestReducer from "../lib/Admin/ManageContestSlice";
import CreateContestReducer from "../lib/Admin/CreateContestSlice";
import leaderboardReducer from "../lib/LeaderBoardSlice";
import upcomingContestReducer from "../lib/UpcomingContestSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    adminStats: adminStatsReducer,
    contestDetails: contestDeatilsReducer,
    forgotPassword: forgotPasswordReducer,
    adminInvite: adminInviteReducer,
    verifyAdmin: verifyAdminInviteReducer,
    registerAdmin: registerAdminReducer,
    manageContest: ManageContestReducer,
    createContest: CreateContestReducer,
    leaderboard: leaderboardReducer,
    upcomingContest: upcomingContestReducer,
  },
});

export { store };
