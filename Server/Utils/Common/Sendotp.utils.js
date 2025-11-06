import { asynchandler, APIERR, APIRES, sendMail } from "../index.js";

const sendOTP = asynchandler(async (req, res) => {
  const { name, email } = req.body;
  console.log("Coming from the Send OTP Body", req.body);

  if (!name || !email) {
    throw new APIERR(400, "Please provide the required fields");
  }

  const templateId = process.env.EMAILJS_SENDOTP_TEMPLATE_ID;

  const templateData = {
    to_name: name,
    to_email: email,
    expiry: process.env.OTP_EXPIRY,
    date: new Date().getFullYear(),
  };

  const sendingOTP = await sendMail(templateId, templateData);
  if (!sendingOTP) {
    throw new APIERR(500, "Err While Sending the OTP");
  }

  const generatedOTP = Math.floor(1000 + Math.random() * 9000);
  console.log("Generated OTP is =>", generatedOTP);

  res.cookie("OTP", generatedOTP, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" ? true : false,
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "none",
    path: "/",
    maxAge: expiry * 60 * 1000,
  });

  res
    .status(200)
    .json(new APIRES(200, "Successfully Sent the OTP to the User"));
});

export { sendOTP };
