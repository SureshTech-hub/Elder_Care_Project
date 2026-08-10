const mongoose = require("mongoose");
const {
  calculateResidentRisk,
  getResidentRisks,
  getAllRisks,
} = require("../services/risk.service");

exports.calculateRisk = async (req, res) => {
  try {
    const { residentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(residentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid resident ID.",
      });
    }

    const risk = await calculateResidentRisk(residentId);

    const populatedRisk = await risk.populate(
      "resident",
      "residentId firstName lastName roomNumber"
    );

    res.status(201).json({
      success: true,
      message: "Risk calculated successfully.",
      data: populatedRisk,
    });
  } catch (error) {
    console.error("Calculate Risk Error:", error);

    if (error.message === "Resident not found") {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error while calculating risk.",
    });
  }
};

exports.getAllRisks = async (req, res) => {
  try {
    const risks = await getAllRisks();

    res.status(200).json({
      success: true,
      count: risks.length,
      data: risks,
    });
  } catch (error) {
    console.error("Get Risks Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while fetching risks.",
    });
  }
};

exports.getResidentRisks = async (req, res) => {
  try {
    const { residentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(residentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid resident ID.",
      });
    }

    const risks = await getResidentRisks(residentId);

    res.status(200).json({
      success: true,
      count: risks.length,
      data: risks,
    });
  } catch (error) {
    console.error("Resident Risks Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while fetching resident risks.",
    });
  }
};