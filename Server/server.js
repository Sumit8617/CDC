import "./config/Envfiles.config.js";
import { app } from "./app.js";
import { connectDB } from "./DB/Db.db.js";
import "./Admin/Controllers/CheckCorrectAnswer.controller.js";
import "./Cron/QuizNotifier.cron.js";

import { startSubmissionWorker } from "./Admin/Worker/SubmissionWorker.controller.js";

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.get("/", (req, res) => {
      res.send("Welcome to our Server");
    });

    app.listen(PORT, () => {
      console.log(`Server is Running on PORT => http://localhost:${PORT}`);
    });

    // 👉 Start your worker AFTER DB + server is running
    startSubmissionWorker();
  })
  .catch((err) => {
    console.error("ERR While Running the Server", err);
  });
