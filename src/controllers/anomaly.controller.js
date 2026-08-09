const mongoose = require("mongoose");

const {
  detectOperationalAnomalies,
  getAllAnomalies,
  getOpenAnomalies,
  updateAnomalyStatus,
} = require("../services/anomaly.service");

exports.detectAnomalies = async (req, res) => {
  try {
    const anomalies = await detectOperationalAnomalies();

    res.status(201).json({
      success: true,
      message: "Anomaly detection completed successfully.",
      count: anomalies.length,
      data: anomalies,
    });
  } catch (error) {
    console.error("Anomaly Detection Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while detecting anomalies.",
    });
  }
};

exports.getAllAnomalies = async (req, res) => {
  try {
    const anomalies = await getAllAnomalies();

    res.status(200).json({
      success: true,
      count: anomalies.length,
      data: anomalies,
    });
  } catch (error) {
    console.error("Get Anomalies Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while fetching anomalies.",
    });
  }
};

exports.getOpenAnomalies = async (req, res) => {
  try {
    const anomalies = await getOpenAnomalies();

    res.status(200).json({
      success: true,
      count: anomalies.length,
      data: anomalies,
    });
  } catch (error) {
    console.error("Get Open Anomalies Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while fetching open anomalies.",
    });
  }
};

exports.updateAnomalyStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid anomaly ID.",
      });
    }

    if (
      !["OPEN", "REVIEWED", "RESOLVED"].includes(status)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Status must be OPEN, REVIEWED or RESOLVED.",
      });
    }

    const anomaly = await updateAnomalyStatus(
      id,
      status
    );

    if (!anomaly) {
      return res.status(404).json({
        success: false,
        message: "Anomaly not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Anomaly status updated successfully.",
      data: anomaly,
    });
  } catch (error) {
    console.error(
      "Update Anomaly Status Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Server error while updating anomaly status.",
    });
  }
};