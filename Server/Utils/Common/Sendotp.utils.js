import { asynchandler, APIERR, APIRES, sendMail } from "../index.utils.js";

const sendOTP = asynchandler(async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    throw new APIERR(400, "Please provide the required fields");
  }

  const generatedOTP = Math.floor(1000 + Math.random() * 9000);

  const templateId = process.env.EMAILJS_SENDOTP_TEMPLATE_ID;

  const expiry = process.env.OTP_EXPIRY;

  const templateData = {
    to_name: name,
    to_email: email,
    otp: generatedOTP,
    expiry,
    date: new Date().getFullYear(),
  };

  const sendingOTP = await sendMail(templateId, templateData);
  if (!sendingOTP) {
    throw new APIERR(500, "Err While Sending the OTP");
  }

  res.cookie("OTP", generatedOTP, {
    httpOnly: true,
    secure: true,
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "none",
    path: "/",
    maxAge: expiry * 60 * 1000,
  });

  res
    .status(200)
    .json(new APIRES(200, "Successfully Sent the OTP to the User"));
});

export { sendOTP };
