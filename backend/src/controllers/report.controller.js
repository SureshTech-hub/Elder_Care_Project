const {
  generateSummaryReport,
} = require("../services/report.service");

exports.getSummaryReport = async (req, res) => {
  try {
    const report = await generateSummaryReport();

    res.status(200).json({
      success: true,
      data: report,
    });
  } catch (error) {
    console.error("Report Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while generating report.",
    });
  }
};