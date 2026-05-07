import nodemailer from "nodemailer";
import { APIERR, APIRES } from "../index.utils.js";

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST, // e.g. smtp.gmail.com
  port: process.env.SMTP_PORT, // 587 or 465
  secure: process.env.SMTP_PORT == 465, // true for 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Send mail function
export const sendMail = async (to, subject, html) => {
  if (!to || !subject || !html) {
    throw new APIERR(400, "Recipient, subject or html is missing");
  }

  try {
    const info = await transporter.sendMail({
      from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
      to,
      subject,
      html,
    });

    console.log("Email sent:", info.messageId);

    return new APIRES(200, "Successfully sent the mail");
  } catch (error) {
    console.error("Failed to send email:", error);
    throw new APIERR(500, error.message || "Email sending failed");
  }
};
