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
  ContestHistory,
  AdminRegister,
  PreviousContestQuestions,
  About,
  Contact,
} from "./Pages/index.js";
import { store } from "./Store/Store.js";
import {
  UserProtectedRoute,
  AdminProtectedRoute,
} from "./Components/Common/Procted.jsx";
import { UserDashboard } from "./Components/index.js";
import NotFoundPage from "./Pages/NotFound.jsx";

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
        path: "/about",
        element: <About />,
      },
      {
        path: "/contact",
        element: <Contact />,
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
        path: "/admin/register",
        element: <AdminRegister />,
      },
      {
        path: "forgot-password",
        element: <ForgotPassword />,
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
            path: "contest-history/:id",
            element: <PreviousContestQuestions />,
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
            path: "admin/contest-history",
            element: <ContestHistory />,
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
      {
        path: "*",
        element: <NotFoundPage />,
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
