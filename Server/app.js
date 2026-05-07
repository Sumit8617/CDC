import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
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
import "./Admin/Controllers/CheckCorrectAnswer.controller.js";

const app = express();

// ========== LOGGING MIDDLEWARE ==========
// Request logger middleware
const requestLogger = (req, res, next) => {
  const start = Date.now();
  const { method, url, ip, headers } = req;
  const userAgent = headers["user-agent"];
  const timestamp = new Date().toISOString();

  // Log incoming request
  /*   console.log(`\n📨 [${timestamp}] ${method} ${url}`);
  console.log(`   IP: ${ip}`);
  console.log(`   User-Agent: ${userAgent}`); */

  // Log request body for POST/PUT/PATCH (excluding sensitive data)
  if (["POST", "PUT", "PATCH"].includes(method) && req.body) {
    const sanitizedBody = { ...req.body };
    // Hide sensitive fields
    if (sanitizedBody.password) sanitizedBody.password = "***";
    if (sanitizedBody.refreshToken) sanitizedBody.refreshToken = "***";
    // console.log(`   Body:`, JSON.stringify(sanitizedBody, null, 2));
  }

  // Capture response
  res.on("finish", () => {
    const duration = Date.now() - start;
    const status = res.statusCode;
    const statusIcon = status >= 400 ? "❌" : "✅";

    /* console.log(
      `${statusIcon} [${timestamp}] ${method} ${url} - ${status} (${duration}ms)`
    ); */

    // Log response for errors
    if (status >= 400) {
      // console.log(`   Error Response: ${status} - ${res.statusMessage}`);
    }
  });

  next();
};

// Body logger for debugging (optional, uncomment if needed)
const bodyLogger = (req, res, next) => {
  const originalJson = res.json;
  res.json = function (body) {
    // Log response body for specific endpoints
    if (req.url.includes("/contact") || req.url.includes("/user")) {
      const sanitizedBody = { ...body };
      if (sanitizedBody.token) sanitizedBody.token = "***";
      if (sanitizedBody.refreshToken) sanitizedBody.refreshToken = "***";
      // console.log(`   Response Body:`, JSON.stringify(sanitizedBody, null, 2));
    }
    originalJson.call(this, body);
  };
  next();
};

// Apply logging middleware
app.use(requestLogger);
// app.use(bodyLogger); // Uncomment if you need response body logging

// ========== CORS CONFIGURATION ==========
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// ========== PARSERS ==========
app.use(express.json({ limit: "100kb" }));
app.use(urlencoded({ limit: "100kb", extended: true }));
app.use(cookieParser());

// ========== ARCJET RATE LIMITING ==========
app.use("/api", async (req, res, next) => {
  try {
    const decision = await aj.protect(req, { requested: 1 });

    if (decision.isDenied()) {
      console.log(
        `🚫 Rate limit exceeded for ${req.ip} on ${req.method} ${req.url}`
      );

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

// ========== ROUTES ==========
console.log("\n🚀 Registering API Routes:\n");

// User routes
console.log("📌 /api/v1/user");
app.use("/api/v1/user", authRoutes);
app.use("/api/v1/user", submitContestResponse);
app.use("/api/v1/user", leaderboardRouter);
app.use("/api/v1/user", contestDetailsRouter);
app.use("/api/v1/user/dashboard", userDashboardRouter);

// Admin routes
console.log("📌 /api/v1/admin");
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/admin/auth", adminAuthRoute);

// Viewer routes
console.log("📌 /api/v1/viewer");
app.use("/api/v1/viewer/", viewersRouter);

// Contact routes
console.log("📌 /api/v1/contact");
app.use("/api/v1/contact", contactRouter);

// ========== 404 Handler ==========
app.use((req, res, next) => {
  console.log(`⚠️  404 Not Found: ${req.method} ${req.url}`);
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.url}`,
    error: "Route not found",
  });
});

// ========== Error Handler ==========
app.use((err, req, res, next) => {
  console.error(`\n🔥 Error Handler:`);
  console.error(`   Time: ${new Date().toISOString()}`);
  console.error(`   Method: ${req.method} ${req.url}`);
  console.error(`   IP: ${req.ip}`);
  console.error(`   Error:`, err.message);
  console.error(`   Stack:`, err.stack);

  const status = err.status || 500;
  const message = err.message || "Internal Server Error";

  res.status(status).json({
    success: false,
    message: message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// ========== Server Startup Log ==========
const logServerStartup = () => {
  console.log("\n" + "=".repeat(60));
  console.log("🎯 SERVER CONFIGURATION");
  console.log("=".repeat(60));
  console.log(`📡 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`🌐 CORS Origin: ${process.env.CORS_ORIGIN}`);
  console.log(`📝 Log Level: ${process.env.LOG_LEVEL || "info"}`);
  console.log("=".repeat(60) + "\n");
};

// Export app with startup logger
export { app, logServerStartup };
