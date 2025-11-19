import { User } from "../Models/User.models.js";
import {
  asynchandler,
  APIERR,
  APIRES,
  sendMail,
} from "../../Utils/index.utils.js";
import { cookieOptions } from "../../Config/Cookie.config.js";

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
  const { fullName, email, mobileNumber, password, role, rollNumber, dob } =
    req.body;

  if (
    [fullName, email, mobileNumber, password, role, rollNumber, dob].some(
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
    fullName,
    email,
    mobileNumber,
    password,
    role,
    rollNumber,
    dob,
  });

  const createdUser = await User.findOne(createUser._id).select(
    "-password -refreshToken"
  );

  // Set the Access Token
  const { accessToken,refreshToken } = await generateAccessAndRefreshTokens(createUser._id);
  
  res.cookie("accessToken", accessToken, cookieOptions);
  res.cookie("refreshToken", refreshToken, cookieOptions);

  if (!accessToken) {
    throw new APIERR(502, "Internal Server ERR! While setting the accesstoken");
  }

  // Send welcome message to the user after successfull signup
  const templateId = process.env.EMAILJS_WELCOME_MESSAGE_TEMPLATE_ID;

  const templateData = {
    name: fullName,
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
    .json(
      new APIRES(200, { user: createdUser }, "Successfully Create the User")
    );
});

const login = asynchandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new APIERR(400, "Please fill the required Fields");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new APIERR(
      400,
      "No account found with this mail. Please Signup first"
    );
  }

  // Match the password
  const isPasswordCorrect = await user.isPasswordValid(password);
  if (!isPasswordCorrect) throw new APIERR(400, "Wrong Password");

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

  
  res.cookie("accessToken", accessToken, cookieOptions);
  res.cookie("refreshToken", refreshToken, cookieOptions);
  res.status(200).json(
    new APIRES(
      200,
      {
        user: {
          _id: user._id,
          role: user.role,
        },
        accessToken,
      },
      "Successfully logged in"
    )
  );
});

const logout = asynchandler(async (req, res) => {
  res.cookie("refreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 0,
  });

  res.cookie("accessToken", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 0,
  });

  return res.status(200).json(new APIRES(200, "Successfully logged out"));
});

const refreshAccessToken = asynchandler(async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken;
  if (!incomingRefreshToken) {
    throw new APIERR(401, "No refresh token found. Please login again");
  }
  try {
    const decoded = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    const user = await User.findById(decoded._id);
    if (!user) {
      throw new APIERR(404, "User not found");
    }
  
    if(incomingRefreshToken !== user.refreshToken){
      throw new APIERR(401,"Refresh Token Mismatch. Please login again")
    }
    const {accessToken,newRefreshToken} = await generateAccessAndRefreshTokens(user._id);
  
    res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", newRefreshToken, cookieOptions)
    .lson(new APIRES(200, {accessToken,refreshToken :newRefreshToken}, "Access Token refreshed Successfully"));
  } catch (error) {
    throw new APIERR(401,error?.message || "Invalid Refresh Token. Please login again")
  } 
})

const changeCurrentPassword = asynchandler(async(req,res)=>{
  const {oldPassword,newPassword,confirmPassword} = req.body;
  if(!oldPassword || !newPassword || !confirmPassword){
    throw new APIERR(400,"Please provide the required fields")
  }
  if(newPassword !== confirmPassword){
    throw new APIERR(400,"New Password and Confirm Password must be same")
  }

  const user = await User.findById(req.user?._id);
  if(!user){
    throw new APIERR(404,"User not found")
  }
  const isOldPasswordCorrect = await user.isPasswordValid(oldPassword);
  if(!isOldPasswordCorrect){
    throw new APIERR(400,"Old Password is incorrect")
  }
  user.password = newPassword;
  await user.save({ validateBeforeSave: false });
  return res.status(200).json(new APIRES(200,{}, "Password changed successfully"))
})


// TODO: Convert to working phase


const checkAuth = (req, res) => {
  if(!req.user){
    throw new APIERR(401,"User not authenticated")
  }
  return res.status(200).json(req.user);
};

export {
  signup,
  login,
  logout,
  checkAuth,
  generateAccessAndRefreshTokens,
  refreshAccessToken,
  changeCurrentPassword
};
