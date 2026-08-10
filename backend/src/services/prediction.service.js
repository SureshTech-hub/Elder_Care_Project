const Prediction = require("../models/Prediction");

exports.createPrediction = async (data) => {
  return await Prediction.create(data);
};

exports.getResidentPredictions = async (residentId) => {
  return await Prediction.find({
    resident: residentId,
  })
    .populate(
      "resident",
      "residentId firstName lastName roomNumber"
    )
    .populate("reviewedBy", "fullName email role")
    .sort({ createdAt: -1 });
};