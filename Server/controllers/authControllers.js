import { generateToken } from "../config/jwt.js"
import User from "../models/userModel.js"
import bcrypt from "bcryptjs"
import cloudinary from "../config/cloudinary.js"

export const signup = async (req, res) => {
    const {name,email,password,profilePic} = req.body

    try {
        if(!name || !email || !password){
            return res.status(400).json("Invalid credentials")
        }
        if(password.length<6){
            return res.status(400).json({message:"Password must be at least 6 characters long"})
        }

        const user = await User.findOne({email})
        if (user) return res.status(400).json({ message: "Email already Exist" });

        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password,salt)

        const newUser = new User({
            name,
            email,
            password:hashPassword
        })

        if(newUser){
            generateToken(newUser._id,res);
            await newUser.save()
            return res.status(200).json({
                _id:newUser._id,
                email:newUser.email,
                name:newUser.name,
                profilePic:newUser.profilePic
            })
        }else{
            return res.status(500).json({message:"Invalid user data"})
        }
    } catch (error) {
        console.log("Error in signup Controller",error)
        return res.status(500).json({message:"Internal server error"})
    }

}


export const login = async (req, res) => {
    const {email,password} = req.body
    
    try {
        if(!email || !password){
            return res.status(400).json("Invalid Credentials")
        }
        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({message:"Email not found"})
        }
        const isMatch = await bcrypt.compare(password,user.password)
        if(!isMatch){
            return res.status(400).json({message:"Invalid Credentials"})
        }
        generateToken(user._id,res)
        return res.status(200).json({
            message:"Login successfully",
            user:{_id:user._id,name:user.name,email:user.email}
        })
    } catch (error) {
        console.log("Error in Login Controller",error)
        return res.status(500).json({message:"Internal Server Error"})
    }
}

export const logout = async (req, res) => {
    try {
       res.cookie("jwt","",{maxAge:0}) 
       return res.status(200).json("Logged out Successfully")
    } catch (error) {
        console.log("Error in logout Controller",error)
        return res.status(400).json({message:"Internal Server Error"})
    }
}


export const updateProfile = async (req, res) => {
    try {
        const {profilePic}= req.body
        const userId = req.user._id
        if(!profilePic){
            return res.status(400).json({ message: "Profile picture is required" });
        }
        const uploadResponse = await cloudinary.uploader.upload(profilePic)
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {profilePic:uploadResponse.secure_url},
            {new:true}
        )
        res.status(200).json(updatedUser)
    } catch (error) {
        console.log("Error in updatedProfile Controller",error)
        return res.status(500).json({ message: "Internal server error" });
    }
}


export const checkAuth = (req, res) => {
    try {
       res.status(200).json(req.user) 
    } catch (error) {
        console.log("Error in checkAuth Controller:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}