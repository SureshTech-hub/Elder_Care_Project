const AuditLog = require("../models/AuditLog");

exports.getAllAuditLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find()
      .populate("user", "fullName email role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: logs.length,
      data: logs,
    });
  } catch (error) {
    console.error("Audit Logs Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while fetching audit logs.",
    });
  }
};

exports.getMyAuditLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: logs.length,
      data: logs,
    });
  } catch (error) {
    console.error("My Audit Logs Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while fetching audit logs.",
    });
  }
};