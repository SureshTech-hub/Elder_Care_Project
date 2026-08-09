const Notification = require("../models/Notification");

const checkNotifications = async () => {
  try {
    const notifications = await Notification.find({
      status: { $ne: "READ" },
    }).sort({ createdAt: -1 });

    console.log(
      `[Notification Job] Unread notifications: ${notifications.length}`
    );

    return notifications;
  } catch (error) {
    console.error("[Notification Job Error]:", error.message);
  }
};

module.exports = {
  checkNotifications,
};