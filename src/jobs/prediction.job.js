const Prediction = require("../models/Prediction");

const checkPredictions = async () => {
  try {
    const activePredictions = await Prediction.find({
      status: "ACTIVE",
    }).sort({ createdAt: -1 });

    console.log(
      `[Prediction Job] Active predictions: ${activePredictions.length}`
    );

    return activePredictions;
  } catch (error) {
    console.error("[Prediction Job Error]:", error.message);
  }
};

module.exports = {
  checkPredictions,
};