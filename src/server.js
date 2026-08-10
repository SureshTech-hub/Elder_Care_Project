require("dotenv").config();


const app = require("./app");
const connectDB = require("./config/db");

const {
  startAlertJob,
} = require("./jobs/alert.job");

const {
  startNotificationJob,
} = require("./jobs/notification.job");

const {
  startPredictionJob,
} = require("./jobs/prediction.job");

const PORT = process.env.PORT || 5000;

connectDB();

app.listen(PORT, () => {
  console.log(
    `Server running on http://localhost:${PORT}`
  );

  startAlertJob();
  startNotificationJob();
  startPredictionJob();
});