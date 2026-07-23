import cron from "node-cron";
import { Test } from "../Admin/Models/Contest.model.js";
import { User } from "../Service/Models/User.models.js";
import { sendMail } from "../Utils/index.utils.js";
import { invalidateCache, CACHE_KEYS } from "../Utils/RedisCache.utils.js";

cron.schedule("0 0 * * *", async () => {
  console.log("Running Daily Check Notification check...");
  const today = new Date();

  const targetDate = new Date(today);
  targetDate.setDate(targetDate.getDate() + 2);

  const start = new Date(targetDate);
  start.setHours(0, 0, 0, 0);
  const end = new Date(targetDate);
  end.setHours(23, 59, 59, 999);

  const upcomingQuizConstest = await Test.find({
    date: { $gte: start, $lte: end },
    notificationsSent: false,
  });

  if (upcomingQuizConstest.length === 0) {
    console.log("No upcoming quiz contests found for notification.");
    return;
  }

  const users = await User.find({ role: "user" });

  for (const contest of upcomingQuizConstest) {
    for (const user of users) {
      // Contest notification email HTML
      const contestHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f4f4f4; padding: 20px;">
          <div style="background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">

            <!-- Header -->
            <div style="background-color: #FF6B00; padding: 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 26px;">${process.env.APP_NAME}</h1>
            </div>

            <!-- Body -->
            <div style="padding: 30px;">
              <h2 style="color: #333333; font-size: 22px;">Hey, ${user.fullName.split(" ")[0]}! </h2>
              <p style="color: #555555; font-size: 15px; line-height: 1.7;">
                You have an upcoming contest in <strong>2 days</strong>. Don't miss it!
              </p>

              <!-- Contest Details Box -->
              <div style="background-color: #f9f9f9; border-left: 4px solid #FF6B00; border-radius: 6px; padding: 16px; margin: 20px 0;">
                <p style="margin: 6px 0; color: #444; font-size: 14px;"><strong>Contest:</strong> ${contest.testName}</p>
                <p style="margin: 6px 0; color: #444; font-size: 14px;"><strong>Date:</strong> ${contest.date.toDateString()}</p>
                <p style="margin: 6px 0; color: #444; font-size: 14px;"><strong>Time:</strong> ${contest.date.toTimeString()}</p>
                <p style="margin: 6px 0; color: #444; font-size: 14px;"><strong>Duration:</strong> ${contest.duration.toString()} minutes</p>
              </div>

              <p style="color: #555555; font-size: 15px; line-height: 1.7;">
                Make sure you're prepared and log in on time. Good luck!
              </p>

              <!-- CTA Button -->
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.FRONTEND_URL}"
                  style="background-color: #FF6B00; color: #ffffff; padding: 14px 32px;
                         text-decoration: none; border-radius: 6px; font-size: 15px; font-weight: bold;">
                  View Contest
                </a>
              </div>

              <p style="color: #555555; font-size: 15px; line-height: 1.7;">
                If you have any questions, feel free to reach out to our
                <a href="mailto:${process.env.SMTP_FROM_EMAIL}" style="color: #FF6B00; text-decoration: none;">support team</a>.
              </p>
            </div>

            <!-- Footer -->
            <div style="background-color: #f0f0f0; padding: 20px; text-align: center;">
              <p style="color: #999999; font-size: 12px; margin: 0;">
                © ${new Date().getFullYear()} ${process.env.APP_NAME}. All rights reserved.
              </p>
            </div>

          </div>
        </div>
      `;

      try {
        await sendMail(
          user.email,
          `Upcoming Contest Reminder: ${contest.testName}`,
          contestHtml
        );
      } catch (error) {
        console.log(`Could not send the email ${user.fullName}`);
      }
    }

    contest.notificationsSent = true;
    await contest.save();
  }

  // Invalidate cache after notifications are sent
  await invalidateCache(`${CACHE_KEYS.UPCOMING_CONTESTS}*`);
  console.log("Cache invalidated after quiz notifications");
});
