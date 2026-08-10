const cron = require("node-cron");
const Prediction = require("../models/Prediction");

const processActivePredictions = async () => {
  try {
    const count = await Prediction.countDocuments({
      status: "ACTIVE",
    });

    console.log(
      `[Prediction Job] Active predictions: ${count}`
    );

    return count;
  } catch (error) {
    console.error(
      "[Prediction Job] Error:",
      error.message
    );

    return 0;
  }
};

const startPredictionJob = () => {
  cron.schedule("*/10 * * * *", async () => {
    await processActivePredictions();
  });

  console.log("[Prediction Job] Started.");
};

module.exports = {
  processActivePredictions,
  startPredictionJob,
};