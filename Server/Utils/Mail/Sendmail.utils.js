import nodemailer from "nodemailer";
import { APIERR, APIRES } from "../index.utils.js";

// Create reusable transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT || 587,
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Function to send email using Nodemailer
export const sendMail = async (to, subject, html) => {
  if (!to || !subject || !html) {
    throw new APIERR(400, "Recipient, subject or html is missing");
  }

  try {
    const info = await transporter.sendMail({
      from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>`,
      to,
      subject,
      html,
    });

    console.log("Email sent successfully:", info.messageId);
    return new APIRES(200, "Successfully sent the mail");
  } catch (error) {
    console.error("Failed to send email:", error);
    throw new APIERR(500, error.message || "Email sending failed");
  }
};
