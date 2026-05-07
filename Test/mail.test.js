// test-email.js
import { sendEmailAsync } from "../Server/Utils/index.utils.js";

// check-env.js

import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from the current directory (Server folder)
const envPath = path.join(__dirname, ".env");

console.log("Loading .env from:", envPath);

if (!fs.existsSync(envPath)) {
  console.error("❌ .env file not found at:", envPath);
  process.exit(1);
}

// Load the .env file
const result = dotenv.config({ path: envPath });

if (result.error) {
  console.error("❌ Error loading .env:", result.error);
  process.exit(1);
}

console.log("✅ .env loaded successfully!\n");

// Display loaded variables
console.log("=== Environment Variables ===");
console.log("SMTP_HOST:", process.env.SMTP_HOST || "❌ NOT SET");
console.log("SMTP_PORT:", process.env.SMTP_PORT || "❌ NOT SET");
console.log("SMTP_USER:", process.env.SMTP_USER || "❌ NOT SET");
console.log("SMTP_PASS:", process.env.SMTP_PASS ? "✅ SET" : "❌ NOT SET");
console.log("SMTP_FROM_NAME:", process.env.SMTP_FROM_NAME || "❌ NOT SET");
console.log("SMTP_FROM_EMAIL:", process.env.SMTP_FROM_EMAIL || "❌ NOT SET");
console.log("APP_NAME:", process.env.APP_NAME || "❌ NOT SET");
console.log("================================\n");

// Check if required variables are set
if (
  !process.env.SMTP_HOST ||
  !process.env.SMTP_USER ||
  !process.env.SMTP_PASS
) {
  console.error("❌ Missing required SMTP configuration!");
  console.log("\nPlease ensure your .env file contains:");
  console.log("SMTP_HOST=smtp.gmail.com");
  console.log("SMTP_PORT=587");
  console.log("SMTP_USER=your-email@gmail.com");
  console.log("SMTP_PASS=your-app-password");
  process.exit(1);
}

// Import email service
// import { sendEmailAsync } from "./Utils/EmailQueue.service.js";

console.log("Testing email service...\n");

const testEmail = process.env.SMTP_USER;

const result_email = await sendEmailAsync(
  testEmail,
  "Test Email - CDC Contact System",
  `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #4F46E5; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">✅ Email Working!</h1>
        </div>
        <div style="background-color: #f4f4f4; padding: 30px; border-radius: 0 0 10px 10px;">
            <p style="font-size: 16px;">If you're seeing this, your email configuration is working correctly!</p>
            <p style="font-size: 14px; color: #666; margin-top: 20px;">Sent at: ${new Date().toLocaleString()}</p>
        </div>
    </div>
    `
);

if (result_email.success) {
  console.log("✅ Test email sent successfully!");
  console.log("Message ID:", result_email.messageId);
  console.log("\nCheck your inbox (and spam folder) for the test email.");
} else {
  console.error("❌ Test email failed:", result_email.error);
  console.log("\nTroubleshooting:");
  console.log(
    "1. For Gmail, use App Password: https://myaccount.google.com/apppasswords"
  );
  console.log("2. Enable 2FA on your Google account first");
  console.log("3. Check if SMTP credentials are correct");
}

/* const testEmail = async () => {
  console.log("Testing email configuration...");

  const result = await sendEmailAsync(
    "test@example.com",
    "Test Email",
    "<h1>Test</h1><p>If you receive this, your email is working!</p>"
  );

  if (result.success) {
    console.log("✅ Email sent successfully!");
  } else {
    console.error("❌ Email failed:", result.error);
  }
};

testEmail(); */
