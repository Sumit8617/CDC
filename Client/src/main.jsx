import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
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
} from "./Pages/index.js";

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
        path: "/contests",
        element: <Contest />,
      },
      {
        path: "/contest-history",
        element: <History />,
      },
      {
        path: "/leaderboard",
        element: <Leaderboard />,
      },
      {
        path: "profile",
        element: <Profile />,
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
        path: "/contest-ended",
        element: <ContestEnd />,
      },
      {
        path: "/forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "/admin/dashboard",
        element: <AdminDashboard />,
      },
      {
        path: "/admin/create-contest",
        element: <CreateContest />,
      },
      {
        path: "/admin/manage-contests",
        element: <ManageContest />,
      },
      {
        path: "/admin/manageusers",
        element: <ManageUsers />,
      },
      {
        path: "/admin/analytics",
        element: <AdminAnalytics />,
      },
      {
        path: "/admin/profile",
        element: <AdminProfile />,
      },
      {
        path: "/admin/settings",
        element: <AdminSettings />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
