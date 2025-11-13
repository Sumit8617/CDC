import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { aj } from "./lib/arcjet.js";
import authRoutes from "./Service/Routes/Auth.routes.js";
import quizRoutes from "./Service/Routes/Quiz.routes.js";
import resultRoutes from "./Service/Routes/Result.routes.js";
import adminRouter from "./Admin/Routes/CreateTest.routes.js";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "100kb" }));
app.use(urlencoded({ limit: "100kb", extended: true }));
app.use(cookieParser());

app.use("/api", async (req, res, next) => {
  try {
    const decision = await aj.protect(req, { requested: 1 });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return res
          .status(429)
          .json({ error: "Too many requests. Please try again later." });
      } else if (decision.reason.isShield()) {
        return res
          .status(403)
          .json({ error: "Request blocked by security shield." });
      } else {
        return res.status(403).json({ error: "Request denied." });
      }
    }

    next();
  } catch (error) {
    console.error("Arcjet error:", error);
    next(error);
  }
});

app.use("/api/v1/user", authRoutes);
app.use("/api/v1/quiz", quizRoutes);
app.use("/api/v1/result", resultRoutes);
app.use("/api/v1/admin", adminRouter);

export { app };
