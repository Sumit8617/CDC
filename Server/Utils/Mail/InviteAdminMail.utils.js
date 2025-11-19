import { asynchandler, APIERR, APIRES, AdminMail } from "../index.utils.js";
import CryptoJS from "crypto-js";

const sendAdminInvite = asynchandler(async (req, res) => {
  const { fullName, email } = req.body;
  console.log("Coming From the Body =>", fullName, email);

  if (!fullName || !email) {
    throw new APIERR(400, "Please provide all the fields");
  }

  // Generate a secure invite token
  const secretKey = process.env.INVITE_SECRET_KEY;
  const timestamp = new Date().getTime();
  const payload = `${email}:${timestamp}`;
  const encryptedToken = CryptoJS.AES.encrypt(payload, secretKey).toString();

  //  Build the invite link
  const baseUrl = process.env.FRONTEND_URL || "http://localhost:3000";
  const inviteLink = `${baseUrl}/admin/register?token=${encodeURIComponent(encryptedToken)}`;

  //  Prepare template data for email
  const templateData = {
    to_name: fullName,
    to_email: email,
    invite_link: inviteLink,
    date: new Date().getFullYear(),
  };

  //  Send email
  try {
    const mailResponse = await AdminMail(
      process.env.EMAILJS_ADMIN_INVITE_TEMPLATE_ID,
      templateData
    );

    if (!mailResponse) {
      throw new APIERR(500, "Failed to send admin invite email");
    }

    //  Respond with success
    res
      .status(200)
      .json(new APIRES(200, `Invite sent successfully to ${email}`));
  } catch (err) {
    console.error("Error sending admin invite:", err);
    throw new APIERR(500, err.message || "Failed to send admin invite");
  }
});

export { sendAdminInvite };
