const Alert = require("../models/Alert");

const checkAlerts = async () => {
  try {
    const activeAlerts = await Alert.find({
      status: "ACTIVE",
    }).sort({ createdAt: -1 });

    console.log(
      `[Alert Job] Active alerts: ${activeAlerts.length}`
    );

    return activeAlerts;
  } catch (error) {
    console.error("[Alert Job Error]:", error.message);
  }
};

module.exports = {
  checkAlerts,
};