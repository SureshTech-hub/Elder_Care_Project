const cron = require("node-cron");
const Notification = require("../models/Notification");

const processUnreadNotifications = async () => {
  try {
    const count = await Notification.countDocuments({
      isRead: false,
    });

    console.log(
      `[Notification Job] Unread notifications: ${count}`
    );

    return count;
  } catch (error) {
    console.error(
      "[Notification Job] Error:",
      error.message
    );

    return 0;
  }
};

const startNotificationJob = () => {
  cron.schedule("*/5 * * * *", async () => {
    await processUnreadNotifications();
  });

  console.log("[Notification Job] Started.");
};

module.exports = {
  processUnreadNotifications,
  startNotificationJob,
};