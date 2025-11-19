import emailjs from "@emailjs/nodejs";
import { APIERR, APIRES } from "../index.utils.js";

export const AdminMail = async (templateId, templateData) => {
  if (!templateId || !templateData) {
    throw new APIERR(400, "Template ID or data is missing");
  }

  try {
    const response = await emailjs.send(
      process.env.EMAILJS_ADMIN_SERVICE_ID,
      templateId,
      templateData,
      {
        publicKey: process.env.EMAILJS_ADMIN_PUBLIC_KEY,
        privateKey: process.env.EMAILJS_ADMIN_PRIVATE_KEY,
      }
    );

    console.log("Email sent successfully:", response);
    return new APIRES(200, "Successfully Sent the mail");
  } catch (error) {
    console.error("Failed to send email:", error);
    throw new APIERR(500, error.text || "Email sending failed");
  }
};
