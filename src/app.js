const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const residentRoutes = require("./routes/resident.routes");
const carePlanRoutes = require("./routes/carePlan.routes");
const medicationRoutes = require("./routes/medication.routes");
const activityRoutes = require("./routes/activity.routes");
const taskRoutes = require("./routes/task.routes");
const incidentRoutes = require("./routes/incident.routes");
const shiftRoutes = require("./routes/shift.routes");
const alertRoutes = require("./routes/alert.routes");
const notificationRoutes = require("./routes/notification.routes");
const auditRoutes = require("./routes/audit.routes");
const predictionRoutes = require("./routes/prediction.routes");
const aiRoutes = require("./routes/ai.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const reportRoutes = require("./routes/report.routes");

const app = express();

// Middlewares
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/residents", residentRoutes);
app.use("/api/v1/care-plans", carePlanRoutes);
app.use("/api/v1/medications", medicationRoutes);
app.use("/api/v1/activities", activityRoutes);
app.use("/api/v1/tasks", taskRoutes);
app.use("/api/v1/incidents", incidentRoutes);
app.use("/api/v1/shifts", shiftRoutes);
app.use("/api/v1/alerts", alertRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/audits", auditRoutes);
app.use("/api/v1/predictions", predictionRoutes);
app.use("/api/v1/ai", aiRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/reports", reportRoutes);


// Health Check
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Elder Care Predictive Operations Command Center API",
    });
});

module.exports = app;