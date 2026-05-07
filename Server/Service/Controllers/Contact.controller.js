import { User } from "../Models/User.models.js";
import { Contact } from "../Models/Contact.models.js";
import {
  asynchandler,
  APIERR,
  APIRES,
  sendMail,
} from "../../Utils/index.utils.js";

const submitContact = asynchandler(async (req, res) => {
  // Rename to avoid conflict with the response message variable
  const { fullName, email, subject, message: userMessage } = req.body;

  // Validate required fields
  if (
    [fullName, email, subject, userMessage].some(
      (f) => !f || String(f).trim() === ""
    )
  ) {
    throw new APIERR(400, "Please provide all required fields");
  }

  // Validate email format
  const emailRegex = /\S+@\S+\.\S+/;
  if (!emailRegex.test(email)) {
    throw new APIERR(400, "Please provide a valid email address");
  }

  // Sanitize inputs
  const sanitizedData = {
    fullName: fullName.trim(),
    email: email.toLowerCase().trim(),
    subject: subject.trim(),
    message: userMessage.trim(),
  };

  // Optional: Save to database if Contact model exists
  try {
    const contactDoc = new Contact(sanitizedData);
    contactDoc.save().catch((err) => {
      console.error("Failed to save contact message:", err);
    });
  } catch (error) {
    console.log("Contact model not found or error saving:", error.message);
  }

  // Prepare email templates
  const brandColor = process.env.BRAND_COLOR || "#4F46E5";
  const appName = process.env.APP_NAME || "Our App";

  // User confirmation HTML
  const userConfirmationHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f4f4f4; padding: 20px;">
      <div style="background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
        <div style="background-color: ${brandColor}; padding: 30px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px;">${appName}</h1>
        </div>
        <div style="padding: 30px;">
          <h2 style="color: #333333; font-size: 20px;">Thank You for Reaching Out, ${sanitizedData.fullName}! 🎉</h2>
          <p style="color: #555555; font-size: 15px; line-height: 1.7;">
            We've received your message and will get back to you as soon as possible.
          </p>
          <div style="background-color: #f9f9f9; border-left: 4px solid ${brandColor}; border-radius: 6px; padding: 16px; margin: 20px 0;">
            <p style="margin: 6px 0; color: #444; font-size: 14px;"><strong>Subject:</strong> ${sanitizedData.subject}</p>
            <p style="margin: 6px 0; color: #444; font-size: 14px;"><strong>Message:</strong></p>
            <p style="margin: 6px 0; color: #555; font-size: 14px; white-space: pre-wrap;">${sanitizedData.message}</p>
          </div>
          <p style="color: #555555; font-size: 15px; line-height: 1.7;">
            Our team typically responds within 24-48 hours. Thank you for your patience!
          </p>
        </div>
        <div style="background-color: #f0f0f0; padding: 20px; text-align: center;">
          <p style="color: #999999; font-size: 12px; margin: 0;">
            © ${new Date().getFullYear()} ${appName}. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  `;

  // Admin notification HTML
  const adminNotificationHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f4f4f4; padding: 20px;">
      <div style="background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
        <div style="background-color: #dc2626; padding: 30px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px;">New Contact Form Submission</h1>
        </div>
        <div style="padding: 30px;">
          <h2 style="color: #333333; font-size: 20px;">You have a new message from ${sanitizedData.fullName}!</h2>
          <div style="background-color: #f9f9f9; border-left: 4px solid #dc2626; border-radius: 6px; padding: 16px; margin: 20px 0;">
            <p style="margin: 6px 0; color: #444; font-size: 14px;"><strong>Name:</strong> ${sanitizedData.fullName}</p>
            <p style="margin: 6px 0; color: #444; font-size: 14px;"><strong>Email:</strong> ${sanitizedData.email}</p>
            <p style="margin: 6px 0; color: #444; font-size: 14px;"><strong>Subject:</strong> ${sanitizedData.subject}</p>
            <p style="margin: 6px 0; color: #444; font-size: 14px;"><strong>Message:</strong></p>
            <p style="margin: 6px 0; color: #555; font-size: 14px; white-space: pre-wrap;">${sanitizedData.message}</p>
          </div>
          <p style="color: #555555; font-size: 14px;">
            Reply to this email to respond to the user.
          </p>
        </div>
        <div style="background-color: #f0f0f0; padding: 20px; text-align: center;">
          <p style="color: #999999; font-size: 12px; margin: 0;">
            © ${new Date().getFullYear()} ${appName}. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  `;

  // Send emails (handle failures gracefully)
  let userEmailSent = false;

  // 1. Send confirmation to user
  try {
    await sendMail(
      sanitizedData.email,
      `${appName} - We Received Your Message`,
      userConfirmationHtml
    );
    userEmailSent = true;
    console.log(`User confirmation sent to ${sanitizedData.email}`);
  } catch (error) {
    console.error(
      `Failed to send user confirmation to ${sanitizedData.email}:`,
      error.message
    );
  }

  // 2. Find and notify admins
  try {
    const admins = await User.find({ role: "admin" })
      .select("email fullName")
      .lean();

    for (const admin of admins) {
      try {
        await sendMail(
          admin.email,
          `New Contact from ${sanitizedData.fullName}`,
          adminNotificationHtml
        );
        console.log(`Admin notification sent to ${admin.email}`);
      } catch (error) {
        console.error(
          `Failed to send admin notification to ${admin.email}:`,
          error.message
        );
      }
    }
  } catch (error) {
    console.error("Failed to fetch admin users:", error.message);
  }

  // Return response - Use a different variable name, not "message"
  const responseMessage = userEmailSent
    ? "Message sent successfully! We'll get back to you soon."
    : "Message received! We'll get back to you soon.";

  return res.status(200).json(new APIRES(200, null, responseMessage));
});

export { submitContact };
