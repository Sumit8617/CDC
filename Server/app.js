import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(
  express.json({
    limit: "100kb",
  })
);

app.use(
  urlencoded({
    limit: "100kb",
    extended: true,
  })
);

app.use(cookieParser());

import authRoutes from "./Service/Routes/Auth.routes.js";
import quizRoutes from "./Service/Routes/Quiz.routes.js";
import resultRoutes from "./Service/Routes/Result.routes.js";

app.use("/api/v1/user", authRoutes);
app.use("/api/v1/quiz", quizRoutes);
app.use("/api/v1/result", resultRoutes);

export { app };
