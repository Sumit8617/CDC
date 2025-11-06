import express from 'express';
import { login, signup, logout,updateProfile,checkAuth } from '../controllers/authControllers.js';
import { protectRoute } from '../middleware/authMiddleware.js';

const router = express.Router();

// router.get('/signup',(req,res)=>{
//     res.json("signup")
// })

// JUST college mail allowed for signup

router.post('/login',login)
router.post('/signup',signup)
router.post('/logout',logout)

router.put("/updateProfile",protectRoute,updateProfile)
router.get("/check",protectRoute,checkAuth)

export default router