import express from "express";
import { submitContact } from "../Controllers/Contact.controller.js";

const router = express.Router();

router.post("/submit", submitContact);

export default router;
