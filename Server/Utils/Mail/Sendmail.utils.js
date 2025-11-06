import emailjs from "@emailjs/nodejs";
import { APIERR, APIRES } from "../index.js";

// Function to send email using EmailJS
export const sendMail = async (templateId, templateData) => {
  if (!templateId || !templateData) {
    throw new APIERR(400, "Template ID or data is missing");
  }

  try {
    const response = await emailjs.send(
      process.env.EMAILJS_SERVICE_ID,
      templateId,
      templateData,
      {
        publicKey: process.env.EMAILJS_PUBLIC_KEY,
        privateKey: process.env.EMAILJS_PRIVATE_KEY,
      }
    );

    console.log("Email sent successfully:", response);
    return new APIRES(200, "Successfully Sent the mail");
  } catch (error) {
    console.error("Failed to send email:", error);
    throw new APIERR(500, error.text || "Email sending failed");
  }
};
