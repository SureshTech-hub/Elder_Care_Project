const Resident = require("../models/Resident");
const User = require("../models/User");
const Task = require("../models/Task");
const Alert = require("../models/Alert");
const Incident = require("../models/Incident");
const Medication = require("../models/Medication");

exports.getDashboardStats = async () => {
  const [
    residents,
    users,
    tasks,
    alerts,
    incidents,
    medications,
  ] = await Promise.all([
    Resident.countDocuments(),
    User.countDocuments(),
    Task.countDocuments(),
    Alert.countDocuments({ status: "ACTIVE" }),
    Incident.countDocuments(),
    Medication.countDocuments({ status: "ACTIVE" }),
  ]);

  return {
    residents,
    users,
    tasks,
    activeAlerts: alerts,
    incidents,
    activeMedications: medications,
  };
};