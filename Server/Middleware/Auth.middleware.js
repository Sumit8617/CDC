import jwt from "jsonwebtoken";
import { User } from "../Service/Models/User.models.js";
import { asynchandler } from "../Utils/index.utils.js";

// Protect route middleware
export const protectRoute = asynchandler(async (req, res, next) => {
  try {
    // Extract token from cookie or Authorization header
    const tokenFromCookie = req.cookies?.accessToken;
    const authHeader = req.headers?.authorization;
    const tokenFromHeader = authHeader?.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

    const token = tokenFromCookie || tokenFromHeader;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No token provided" });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch (err) {
      console.error("JWT verification failed:", err);
      return res.status(401).json({ message: "Unauthorized - Invalid or expired token" });
    }

    // Find user by ID
    const user = await User.findById(decoded._id).select("-password -refreshToken");
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
  // Make sure req.user exists
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied - Admins only" });
  }
  next();
};
