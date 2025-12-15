import jwt from "jsonwebtoken";
import { User } from "../Service/Models/User.models.js";
import { asynchandler } from "../Utils/index.utils.js";

// Protect route middleware
export const protectRoute = asynchandler(async (req, res, next) => {
  console.log("Cookies:", req.cookies);
  console.log("Auth Header:", req.headers.authorization);

  try {
    // Extract token from cookie or Authorization header
    const tokenFromCookie = req.cookies?.accessToken;
    const authHeader = req.headers?.authorization;
    const tokenFromHeader = authHeader?.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

    const token = tokenFromCookie || tokenFromHeader;
    console.log("Extracted Token:", token);

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized - No token provided" });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      console.log("Decoded JWT:", decoded);
    } catch (err) {
      console.error("JWT verification failed:", err);
      return res
        .status(401)
        .json({ message: "Unauthorized - Invalid or expired token" });
    }

    // Find user by ID
    const user = await User.findById(decoded._id).select(
      "-password -refreshToken"
    );
    console.log("Authenticated User:", user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Error in protectRoute middleware:", error);
    return res.status(401).json({ message: "Unauthorized" });
  }
});

// Admin only middleware
export const adminOnly = (req, res, next) => {
  // Allow CORS preflight
  if (req.method === "OPTIONS") {
    return next();
  }

  if (!req.user) {
    console.log("Access denied. req.user is missing");
    return res.status(403).json({ message: "Access denied - Admins only" });
  }

  if (req.user.role !== "admin") {
    console.log("Access denied. User role:", req.user.role);
    return res.status(403).json({ message: "Access denied - Admins only" });
  }

  next();
};
