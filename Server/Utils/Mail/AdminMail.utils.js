import emailjs from "@emailjs/nodejs";
import { APIERR, APIRES } from "../index.utils.js";

export const AdminMail = async (templateId, templateData) => {
  if (!templateId || !templateData) {
    throw new APIERR(400, "Template ID or data is missing");
  }

  try {
    const response = await emailjs.send(
      process.env.ADMIN_INVITE_EMAIL_SERVICE,
      templateId,
      templateData,
      {
        publicKey: process.env.ADMIN_INVITE_EMAIL_PUBLIC_KEY,
        privateKey: process.env.ADMIN_INVITE_EMAIL_PRIVATE_KEY,
      }
    );

    console.log("Email sent successfully:", response);
    return new APIRES(200, "Successfully Sent the mail");
  } catch (error) {
    console.error("Failed to send email:", error);
    throw new APIERR(500, error.text || "Email sending failed");
  }
};