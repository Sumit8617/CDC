import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import {
  Home,
  Contest,
  History,
  Leaderboard,
  Profile,
  Signup,
  Login,
  ContestEnd,
  ForgotPassword,
  AdminDashboard,
  CreateContest,
  ManageContest,
  ManageUsers,
  AdminAnalytics,
  AdminProfile,
  AdminSettings,
  AdminLogin,
} from "./Pages/index.js";
import { store } from "./Store/Store.js";
import {
  UserProtectedRoute,
  AdminProtectedRoute,
} from "./Components/Common/Procted.jsx";
import { UserDashboard } from "./Components/index.js";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/admin/login",
        element: <AdminLogin />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
      {
        element: <UserProtectedRoute />,
        children: [
          {
            path: "dashboard",
            element: <UserDashboard />,
          },
          {
            path: "contests",
            element: <Contest />,
          },
          {
            path: "contest-history",
            element: <History />,
          },
          {
            path: "leaderboard",
            element: <Leaderboard />,
          },
          {
            path: "profile",
            element: <Profile />,
          },
          {
            path: "contest-ended",
            element: <ContestEnd />,
          },
          {
            path: "forgot-password",
            element: <ForgotPassword />,
          },
        ],
      },
      {
        element: <AdminProtectedRoute />,
        children: [
          {
            path: "admin/dashboard",
            element: <AdminDashboard />,
          },
          {
            path: "admin/create-contest",
            element: <CreateContest />,
          },
          {
            path: "admin/manage-contests",
            element: <ManageContest />,
          },
          {
            path: "admin/manageusers",
            element: <ManageUsers />,
          },
          {
            path: "admin/analytics",
            element: <AdminAnalytics />,
          },
          {
            path: "admin/profile",
            element: <AdminProfile />,
          },
          {
            path: "admin/settings",
            element: <AdminSettings />,
          },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);
