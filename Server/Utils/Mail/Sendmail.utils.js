import { Resend } from "resend";
import { APIERR, APIRES } from "../index.utils.js";

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Function to send email
export const sendMail = async (to, subject, html) => {
  if (!to || !subject || !html) {
    throw new APIERR(400, "Recipient, subject or html is missing");
  }

  try {
    const response = await resend.emails.send({
      from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
      to,
      subject,
      html,
    });

    console.log("Email sent successfully:", response);

    return new APIRES(200, "Successfully sent the mail");
  } catch (error) {
    console.error("Failed to send email:", error);
    throw new APIERR(500, error.message || "Email sending failed");
  }
};
