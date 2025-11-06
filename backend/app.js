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

import authRoutes from "./routes/authRoutes.js";
import quizRoutes from "./routes/quizRoutes.js";
import resultRoutes from "./routes/resultRoutes.js";

app.use(authRoutes);
app.use(quizRoutes);
app.use(resultRoutes);

export { app };
