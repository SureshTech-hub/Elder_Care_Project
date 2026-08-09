const Resident = require("../models/Resident");
const Task = require("../models/Task");
const Incident = require("../models/Incident");
const Medication = require("../models/Medication");
const Alert = require("../models/Alert");

exports.generateSummaryReport = async () => {
  const [
    totalResidents,
    totalTasks,
    totalIncidents,
    activeMedications,
    activeAlerts,
  ] = await Promise.all([
    Resident.countDocuments(),
    Task.countDocuments(),
    Incident.countDocuments(),
    Medication.countDocuments({
      status: "ACTIVE",
    }),
    Alert.countDocuments({
      status: "ACTIVE",
    }),
  ]);

  return {
    generatedAt: new Date(),
    totalResidents,
    totalTasks,
    totalIncidents,
    activeMedications,
    activeAlerts,
  };
};