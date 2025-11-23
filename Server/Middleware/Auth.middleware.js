import jwt from "jsonwebtoken";
import { User } from "../Service/Models/User.models.js";
import { asynchandler } from "../Utils/index.utils.js";

export const protectRoute = asynchandler(async (req, res, next) => {
  try {
    //  Extract token from cookie or header
    const tokenFromCookie = req.cookies?.accessToken;

    const authHeader = req.headers?.authorization; // lowercase!!
    const tokenFromHeader = authHeader?.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

    const token = tokenFromCookie || tokenFromHeader;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No token" });
    }

    //  Verify token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    //  Find user
    const user = await User.findById(decoded?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("Error in authMiddleware:", error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
});

export const adminOnly = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ message: "Access denied - Admins only" });
  }
  next();
};
