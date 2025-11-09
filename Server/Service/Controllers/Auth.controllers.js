import { User } from "../Models/User.models.js";
import { cloudinary } from "../../Config/Cloudinary.config.js";
import {
  asynchandler,
  APIERR,
  APIRES,
  sendMail,
} from "../../Utils/index.utils.js";
import { cookieOptions } from "../../config/Cookie.config.js";

const generateAccessAndRefreshTokens = asynchandler(async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    await user.hashRefreshToken(refreshToken);
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    console.log("Err While Generating the Tokens", error);
  }
});

const signup = asynchandler(async (req, res) => {
  const { name, email, mobileNumber, password, role } = req.body;

  if (
    [name, email, mobileNumber, password, role].some(
      (f) => !f || String(f).trim() === ""
    )
  ) {
    throw new APIERR(400, "Please provide the required fields");
  }

  if (password.length < 6) {
    throw new APIERR(400, "Password length must be 6");
  }

  //   Find that if the user already exist or not
  const existeduser = await User.findOne({ mobileNumber });
  if (existeduser) {
    throw new APIERR(400, "User already exist. Please login instead of Signup");
  }

  // Ensure that the OTP is verified

  const isVerified = req.cookies?.isEmailVerified;
  if (!isVerified) {
    throw new APIERR(400, "Please verify your email");
  }

  // Create user
  const createUser = await User.create({
    name,
    email,
    mobileNumber,
    password,
    role,
  });

  const createdUser = await User.find({ mobileNumber }).select(
    "-password -refreshToken"
  );

  // Set the Access Token
  const { accessToken } = await generateAccessAndRefreshTokens(createUser._id);
  res.cookie("accessToken", accessToken, cookieOptions);

  if (!accessToken) {
    throw new APIERR(502, "Internal Server ERR! While setting the accesstoken");
  }

  // Send welcome message to the user after successfull signup
  const templateId = process.env.EMAILJS_WELCOME_MESSAGE_TEMPLATE_ID;

  const templateData = {
    name,
    email,
    appLink: ``,
    supportLink: ``,
    currentYear: new Date().getFullYear(),
  };

  try {
    await sendMail(templateId, templateData);
    console.log("Email Sent");
  } catch (error) {
    console.error("ERR While Sending the Welcome Message mail", error);
  }

  // Final Response
  res
    .status(200)
    .json(new APIRES(200, createdUser, "Successfully Create the User"));
});

const login = asynchandler(async (req, res) => {
  const { mobileNumber, password } = req.body;

  if (!mobileNumber || !password) {
    throw new APIERR(400, "Please fill the required Fields");
  }

  const user = await User.findOne({ mobileNumber });
  if (!user) {
    throw new APIERR(
      400,
      "No account found with this mobile. Please Signup first"
    );
  }

  // Match the password
  const isPasswordCorrect = await user.isPasswordValid(password);
  if (!isPasswordCorrect) {
    throw new APIERR(400, "Wrong Password");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );
  res.cookie("accessToken", accessToken, cookieOptions);
  res.cookie("refreshToken", refreshToken, cookieOptions);
  res.status(200).json(new APIRES(200, "Successfully logged in"));
});

const logout = asynchandler(async (res) => {
  res.cookie("refreshToken", "", {
    maxAge: 0,
  });
  res.status(200).json(new APIRES(200, "Successfully log out"));
});

// TODO: Convert to working phase
const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;
    if (!profilePic) {
      return res.status(400).json({ message: "Profile picture is required" });
    }
    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("Error in updatedProfile Controller", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth Controller:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export { signup, login, logout, updateProfile, checkAuth };
