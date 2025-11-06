import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import quizRoutes from './routes/quizRoutes.js';
import resultRoutes from './routes/resultRoutes.js';
import { connDB } from './config/db.js';
import cookieParser from 'cookie-parser'

dotenv.config();
const PORT = process.env.PORT || 5000;

const app = express();

app.use(cookieParser())
app.use(express.urlencoded({extended:true, limit: "100kb"}));
app.use(cors({
    limit : "100kb",
    origin: "http://localhost:3000",
    credentials: true,
}));
app.use(express.json({
    limit: "100kb",
}));

app.use("/api/auth",authRoutes);
app.use("/api/quiz",quizRoutes);
app.use("/api/result",resultRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connDB()
});