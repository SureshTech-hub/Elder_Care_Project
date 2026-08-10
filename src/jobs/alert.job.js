const cron = require("node-cron");
const Alert = require("../models/Alert");

const processActiveAlerts = async () => {
  try {
    const count = await Alert.countDocuments({
      status: "ACTIVE",
    });

    console.log(
      `[Alert Job] Active alerts: ${count}`
    );

    return count;
  } catch (error) {
    console.error(
      "[Alert Job] Error:",
      error.message
    );

    return 0;
  }
};

const startAlertJob = () => {
  cron.schedule("*/5 * * * *", async () => {
    await processActiveAlerts();
  });

  console.log("[Alert Job] Started.");
};

module.exports = {
  processActiveAlerts,
  startAlertJob,
};