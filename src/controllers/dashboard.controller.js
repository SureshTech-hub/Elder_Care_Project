const { getDashboardStats } = require("../services/dashboard.service");

exports.getDashboard = async (req, res) => {
  try {
    const stats = await getDashboardStats();

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("Dashboard Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while fetching dashboard.",
    });
  }
};