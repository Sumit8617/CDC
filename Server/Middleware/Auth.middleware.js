import jwt from "jsonwebtoken";
// import {User} from "../models/userModel.js"
import { User } from "../Service/Models/User.models.js";

export const protectRoute = async (req, res, next) => {
  try {
    const auth_token = req.cookies?.jwt;
    if (!auth_token) {
      return res.status(401).json({ message: "Unouthorized-NO token" });
    }
    const decoded = jwt.verify(auth_token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ message: "Unouthorized- Invalid token" });
    }

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not Found" });
    }
    req.user = user;
    next();
  } catch (error) {
    console.log("Error in authMiddleware function", error);
    return res
      .status(500)
      .json({ message: "Internal server error in auth middleware" });
  }
};

export const adminOnly = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ message: "Access denied - Admins only" });
  }
  next();
};
