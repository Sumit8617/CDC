import { asynchandler, APIERR, APIRES } from "../index.js";

const verifyOTP = asynchandler(async (req, res) => {
  const { otp } = req.body;
  console.log("Coming from the Verify OTP Body =>", otp);

  const storedOTP = req.cookies?.OTP || "NO OTP FOUND";
  if (!storedOTP) {
    throw new APIERR(
      400,
      "OTP may be expire or incorrect. Please generate a new OTP"
    );
  }

  // Comapre the OTP
  if (storedOTP !== otp) {
    throw new APIERR(400, "Incorrect OTP");
  }

  // If otp verified raise a flag that the email is verified
  res.cookie("isEmailVerified", true, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" ? true : false,
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "none",
    path: "/",
  });

  res.status(200).json(new APIRES(200, "OTP Verified"));
});

export { verifyOTP };
