import { Router } from "express";
import { adminLogin } from "../Controllers/Auth.controller.js";

const adminAuthRoute = Router();

adminAuthRoute.route("/login").post(adminLogin);

export { adminAuthRoute };
