import { asynchandler, APIERR, APIRES, sendMail } from "../index.utils.js";
import { User } from "../../Service/Models/User.models.js";

// Parse allowed domains from .env safely (mirrors the same logic in user.model.js)
let allowedDomains = [];
try {
  allowedDomains = JSON.parse(process.env.COLLEGE_EMAIL_DOMAINS || "[]");
  if (!Array.isArray(allowedDomains)) allowedDomains = [];
} catch (err) {
  console.error("Invalid COLLEGE_EMAIL_DOMAINS format in .env");
  allowedDomains = [];
}

const isAllowedDomain = (email) => {
  if (!allowedDomains.length) return true; // no restriction configured → allow all

  const pattern = `^[a-zA-Z0-9._%+-]+@(${allowedDomains
    .map((d) => d.replace(/^[^@]*@/, "").replace(/\./g, "\\."))
    .join("|")})$`;

  return new RegExp(pattern).test(email);
};

const sendOTP = asynchandler(async (req, res) => {
  const { fullName, email } = req.body;
  console.log("Coming from Body", fullName, email);

  if (!fullName || !email) {
    throw new APIERR(400, "Please provide the required fields");
  }

  // ── 1. Domain validation ─────────────────────────────────────────────────
  if (!isAllowedDomain(email)) {
    throw new APIERR(
      400,
      `Only official college emails are accepted (${allowedDomains.join(", ")})`
    );
  }

  // ── 2. User existence check ──────────────────────────────────────────────
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw new APIERR(
      409,
      "An account with this email already exists. Please log in instead."
    );
  }

  // ── Everything below is UNCHANGED ────────────────────────────────────────
  const generatedOTP = Math.floor(1000 + Math.random() * 9000);

  const expiry = process.env.OTP_EXPIRY;

  // OTP email HTML
  const otpHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f4f4f4; padding: 20px;">
      <div style="background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">

        <!-- Header -->
        <div style="background-color: orange; padding: 30px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 26px;">${process.env.APP_NAME}</h1>
        </div>

        <!-- Body -->
        <div style="padding: 30px;">
          <h2 style="color: #333333; font-size: 22px;">Hello, ${fullName}!</h2>
          <p style="color: #555555; font-size: 15px; line-height: 1.7;">
            Use the OTP below to verify your email address. 
            This OTP is valid for <strong>${expiry} minutes</strong>.
          </p>

          <!-- OTP Box -->
          <div style="text-align: center; margin: 30px 0;">
            <div style="display: inline-block; background-color: #f9f9f9; border: 2px dashed orange;
                        border-radius: 10px; padding: 20px 40px;">
              <p style="margin: 0; font-size: 36px; font-weight: bold; color: orange; letter-spacing: 10px;">
                ${generatedOTP}
              </p>
            </div>
          </div>

          <p style="color: #555555; font-size: 15px; line-height: 1.7;">
            If you did not request this OTP, please ignore this email or contact our 
            <a href="${process.env.SUPPORT_URL}" style="color: orange; text-decoration: none;">support team</a> 
            immediately.
          </p>
        </div>

        <!-- Footer -->
        <div style="background-color: #f0f0f0; padding: 20px; text-align: center;">
          <p style="color: #999999; font-size: 12px; margin: 0;">
            © ${new Date().getFullYear()} ${process.env.APP_NAME}. All rights reserved.
          </p>
        </div>

      </div>
    </div>
  `;

  const sendingOTP = await sendMail(
    email,
    `Your OTP for ${process.env.APP_NAME}`,
    otpHtml
  );
  if (!sendingOTP) {
    throw new APIERR(500, "Err While Sending the OTP");
  }

  res.cookie("OTP", generatedOTP, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: expiry * 60 * 1000,
  });

  res
    .status(200)
    .json(new APIRES(200, "Successfully Sent the OTP to the User"));
});

export { sendOTP };
