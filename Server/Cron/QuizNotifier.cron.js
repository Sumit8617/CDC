import cron from "node-cron";
import { Test } from "../Admin/Models/Contest.model.js";
import { User } from "../Service/Models/User.models.js";
import { contestNotification } from "../Utils/Mail/ContestNotification.js";


cron.schedule("0 0 * * *", async () => {
    console.log("Running Daily Check Notification check...")
// 07/12/2025
    const today = new Date();

    const targetDate = new Date(today);
    targetDate.setDate(targetDate.getDate()+2)

    const start = new Date(targetDate.setHours(0, 0, 0, 0));
    const end = new Date(targetDate.setHours(23, 59, 59, 999));

    const upcomingQuizConstest = await Test.find({
        date: { $gte: start, $lte: end }, // 05/12/2025
        notificationsSent: false
    });

    if(upcomingQuizConstest.length ===0){
        console.log("No upcoming quiz contests found for notification.")
        return;
    }

    const users = await User.find({ role: "user" });

    for(const contest of upcomingQuizConstest){
        for(const user of users){
            try {
                await contestNotification(process.env.EMAILJS_QUIZ_NOTIFICATION_TEMPLATE_ID,{
                    to_name: user.fullName.split(" ")[0],
                    to_email: user.email,
                    contest_name: contest.testName,
                    contest_date: contest.date.toDateString(),
                    contest_time: contest.date.toTimeString(),
                    contest_duration: contest.duration.toString()
                })
            } catch (error) {
                console.log(`Could not send the email ${user.fullName}`)
            }

            Test.notificationsSent = true;
            await Test.save();
        }
    }
})