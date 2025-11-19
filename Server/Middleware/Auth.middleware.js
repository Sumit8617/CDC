import jwt from "jsonwebtoken";
import { User } from "../Service/Models/User.models.js";
import { asynchandler } from "../Utils/index.utils.js";

export const protectRoute = asynchandler(async(req,res,next)=>{
  try {
    // 1. Access token from cookies
    const auth_token = req.cookies?.accessToken || req.headers("Authorization")?.replace("Bearer ","");
    if (!auth_token) {
      return res.status(401).json({ message: "Unouthorized-NO token" });
    }
      // 2. Verify access token
    
      const decoded = jwt.verify(auth_token, process.env.ACCESS_TOKEN_SECRET);
      // 3. Find user in DB
      const user = await User.findById(decoded?._id).select("-password -refreshToken");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      req.user = user;
      next();
  } catch (error) {
    console.log("Error in authMiddleware function", error);
    return res
      .status(500)
      .json({ message: "Internal server error in auth middleware" });
  }
})



export const adminOnly = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ message: "Access denied - Admins only" });
  }
  next();
};
