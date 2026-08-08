import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { aj } from "./lib/arcjet.js";
import authRoutes from "./Service/Routes/Auth.routes.js";
import submitContestResponse from "./Service/Routes/SubmitContest.routes.js";
import adminRouter from "./Admin/Routes/CreateTest.routes.js";
import leaderboardRouter from "./Service/Routes/Leaderboard.routes.js";
import { adminAuthRoute } from "./Admin/Routes/Auth.routes.js";
import contestDetailsRouter from "./Service/Routes/TestDetails.routes.js";
import viewersRouter from "./Service/Routes/Statistic.routes.js";
import contactRouter from "./Service/Routes/Contact.routes.js";
import userDashboardRouter from "./Service/Routes/UserDashboard.routes.js";
import userRouter from "./Admin/Routes/User.routes.js";
import "./Admin/Controllers/CheckCorrectAnswer.controller.js";
import { checkRedisHealth, getCacheStats } from "./Utils/RedisHealth.utils.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, "logs");
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// Log file paths
const accessLogPath = path.join(logsDir, "access.log");
const errorLogPath = path.join(logsDir, "error.log");
const rateLimitLogPath = path.join(logsDir, "ratelimit.log");

// Helper to create table borders
const createTableBorder = (width) => "+" + "-".repeat(width - 2) + "+";
const createTableRow = (columns, widths) => {
  return (
    "|" +
    columns
      .map((col, i) => {
        const padded = String(col).padEnd(widths[i]);
        return ` ${padded} `;
      })
      .join("|") +
    "|"
  );
};

// Logger utility with table format
const writeToFile = (filePath, tableData) => {
  const timestamp = new Date().toISOString();
  const date = new Date().toLocaleDateString();
  const time = new Date().toLocaleTimeString();

  // Table configuration
  const headers = ["TIMESTAMP", "DATE", "TIME", "DETAILS"];
  const columnWidths = [24, 12, 12, 60];
  const totalWidth = columnWidths.reduce((a, b) => a + b + 3, 4); // +3 for separators and spaces

  let tableContent = [];

  // Table header
  tableContent.push(createTableBorder(totalWidth));
  tableContent.push(createTableRow(headers, columnWidths));
  tableContent.push(createTableBorder(totalWidth));

  // Table data
  const row = [timestamp, date, time, tableData];
  tableContent.push(createTableRow(row, columnWidths));
  tableContent.push(createTableBorder(totalWidth));
  tableContent.push(""); // Empty line between entries

  fs.appendFileSync(filePath, tableContent.join("\n"), "utf8");
};

const logAccess = (message) => writeToFile(accessLogPath, message);
const logError = (message) => writeToFile(errorLogPath, message);
const logRateLimit = (message) => writeToFile(rateLimitLogPath, message);

// Request logging middleware
const requestLogger = (req, res, next) => {
  const start = Date.now();
  const { method, url, ip, headers } = req;
  const userAgent = headers["user-agent"];

  // Build log message for request
  let logMessage = `REQUEST | ${method} ${url} | IP: ${ip} | User-Agent: ${userAgent}`;

  if (["POST", "PUT", "PATCH"].includes(method) && req.body) {
    const sanitizedBody = { ...req.body };
    if (sanitizedBody.password) sanitizedBody.password = "***";
    if (sanitizedBody.refreshToken) sanitizedBody.refreshToken = "***";
    logMessage += ` | Body: ${JSON.stringify(sanitizedBody)}`;
  }

  logAccess(logMessage);

  // Log response completion
  res.on("finish", () => {
    const duration = Date.now() - start;
    const status = res.statusCode;

    const responseLog = `RESPONSE | ${method} ${url} | Status: ${status} | Duration: ${duration}ms`;
    logAccess(responseLog);

    if (status >= 400) {
      const errorLog = `ERROR | ${method} ${url} | Status: ${status} ${res.statusMessage} | IP: ${ip} | Duration: ${duration}ms`;
      logError(errorLog);
    }
  });

  next();
};

// Apply logging middleware
app.use(requestLogger);

// CORS configuration
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// Request parsers
app.use(express.json({ limit: "100kb" }));
app.use(urlencoded({ limit: "100kb", extended: true }));
app.use(cookieParser());

// Arcjet rate limiting middleware
app.use("/api", async (req, res, next) => {
  try {
    const decision = await aj.protect(req, { requested: 1 });

    if (decision.isDenied()) {
      const rateLimitMsg = `RATE_LIMIT | ${req.method} ${req.url} | IP: ${req.ip} | Reason: ${decision.reason.isRateLimit() ? "Rate Limit" : "Shield"}`;
      logRateLimit(rateLimitMsg);

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
    const errorMsg = `ARCJET_ERROR | ${error.message}`;
    logError(errorMsg);
    next(error);
  }
});

// API Routes
app.use("/api/v1/user", authRoutes);
app.use("/api/v1/user", submitContestResponse);
app.use("/api/v1/user", leaderboardRouter);
app.use("/api/v1/user", contestDetailsRouter);
app.use("/api/v1/user/dashboard", userDashboardRouter);

// Admin routes
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/admin/auth", adminAuthRoute);
app.use("/api/v1/admin", userRouter);

// Viewer routes
app.use("/api/v1/viewer/", viewersRouter);

// Contact routes
app.use("/api/v1/contact", contactRouter);

// Health check endpoints
app.get("/health", async (req, res) => {
  const redisHealth = await checkRedisHealth();
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    redis: redisHealth,
  });
});

app.get("/health/cache", async (req, res) => {
  const stats = await getCacheStats();
  res.status(200).json(stats);
});

// 404 handler for unmatched routes
app.use((req, res, next) => {
  const notFoundMsg = `404_NOT_FOUND | ${req.method} ${req.url} | IP: ${req.ip}`;
  logError(notFoundMsg);

  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.url}`,
    error: "Route not found",
  });
});

// Global error handler
app.use((err, req, res, next) => {
  const errorMsg = `GLOBAL_ERROR | ${err.message} | Method: ${req.method} ${req.url} | IP: ${req.ip} | Stack: ${err.stack}`;
  logError(errorMsg);

  const status = err.status || 500;
  const message = err.message || "Internal Server Error";

  res.status(status).json({
    success: false,
    message: message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// Server startup logging
const logServerStartup = () => {
  const startupMsg = `SERVER_STARTUP | Environment: ${process.env.NODE_ENV || "development"} | CORS: ${process.env.CORS_ORIGIN} | Log Level: ${process.env.LOG_LEVEL || "info"}`;
  logAccess(startupMsg);

  console.log("\n" + "=".repeat(60));
  console.log(" SERVER CONFIGURATION");
  console.log("=".repeat(60));
  console.log(`📡 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`🌐 CORS Origin: ${process.env.CORS_ORIGIN}`);
  console.log(`📝 Log Level: ${process.env.LOG_LEVEL || "info"}`);
  console.log(`📁 Logs Directory: ${logsDir}`);
  console.log("=".repeat(60) + "\n");
};

export { app, logServerStartup };
