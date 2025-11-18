import { asynchandler, APIERR, APIRES } from "../../Utils/index.utils.js";
import { User } from "../../Service/Models/User.models.js";
import { generateAccessAndRefreshTokens } from "../../Service/Controllers/Auth.controllers.js";

const adminLogin = asynchandler(async (req, res) => {
  const { email, mobileNumber, password } = req.body;
  console.log("Coming From the Admin Login =>", email, mobileNumber, password);
  if ([email, mobileNumber, password].some((f) => !f || f.trim() === "")) {
    throw new APIERR(400, "Please provide all the fields");
  }

  //   Find the existed user with admin role
  const existedUser = await User.findOne({ email, role: "admin" });

  if (!existedUser) {
    throw new APIERR(404, "Admin user with this email is not found");
  }

  //   Match the user Password
  const isPasswordCorrect = await existedUser.isPasswordValid(password);
  if (!isPasswordCorrect) {
    throw new APIERR(402, "Password is not Correct");
  }

  //   Generate TOkens
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    existedUser._id
  );

  if (!accessToken || !refreshToken) {
    throw new APIERR(502, "ERR While Generating the acess and refresh TOkens");
  }

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 60 * 1000,
  });

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 60 * 1000,
  });

  res.status(200).json(
    new APIRES(
      200,
      {
        user: existedUser._id,
        role: existedUser.role,
      },
      "Successfully logged in "
    )
  );
});

export { adminLogin };
