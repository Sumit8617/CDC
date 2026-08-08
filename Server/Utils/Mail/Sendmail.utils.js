import nodemailer from "nodemailer";
import { APIERR, APIRES } from "../index.utils.js";

// Create transporter with explicit timeouts
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: Number(process.env.SMTP_PORT) === 465, // true ONLY for 465 (SSL)
  requireTLS: Number(process.env.SMTP_PORT) === 587, // force STARTTLS on 587
  family: 4, // force IPv4 — Gmail often misroutes over IPv6
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  connectionTimeout: 10_000, // 10s to establish TCP
  greetingTimeout: 10_000, // 10s for server greeting
  socketTimeout: 15_000, // 15s inactivity on socket
  pool: true, // reuse connection across requests
  maxConnections: 5,
  maxMessages: 100,
  tls: {
    rejectUnauthorized: false, // helpful for self-signed chains minVersion: "TLSv1.2",
  },
});

// Verify the transporter at startup so failures are loud, not silent
transporter.verify((err, success) => {
  if (err) {
    console.error("SMTP verify failed:", err.message);
  } else {
    console.log("SMTP server ready");
  }
});

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
    console.error("Failed to send email:", error.message);
    throw new APIERR(500, error.message || "Email sending failed");
  }
};
