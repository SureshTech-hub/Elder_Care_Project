const Resident = require("../models/Resident");
const Incident = require("../models/Incident");
const Task = require("../models/Task");
const Medication = require("../models/Medication");
const Risk = require("../models/Risk");

const getRiskLevel = (score) => {
  if (score >= 80) return "CRITICAL";
  if (score >= 60) return "HIGH";
  if (score >= 30) return "MEDIUM";
  return "LOW";
};

exports.calculateResidentRisk = async (residentId) => {
  const resident = await Resident.findById(residentId);

  if (!resident) {
    throw new Error("Resident not found");
  }

  const incidents = await Incident.find({
    resident: residentId,
  });

  const pendingTasks = await Task.countDocuments({
    resident: residentId,
    status: { $in: ["PENDING", "IN_PROGRESS"] },
  });

  const activeMedications = await Medication.countDocuments({
    resident: residentId,
    status: "ACTIVE",
  });

  let score = 0;
  const factors = [];
  const recommendations = [];

  // Age factor
  if (resident.age >= 80) {
    score += 20;
    factors.push("Resident age is 80 or above.");
  } else if (resident.age >= 70) {
    score += 10;
    factors.push("Resident age is 70 or above.");
  }

  // Medical conditions
  if (resident.medicalConditions?.length >= 3) {
    score += 20;
    factors.push("Multiple medical conditions recorded.");
  } else if (resident.medicalConditions?.length >= 1) {
    score += 10;
    factors.push("Medical conditions are recorded.");
  }

  // Incidents
  const recentIncidents = incidents.filter((incident) => {
    const days =
      (Date.now() - new Date(incident.incidentDate).getTime()) /
      (1000 * 60 * 60 * 24);

    return days <= 30;
  });

  if (recentIncidents.length >= 3) {
    score += 30;
    factors.push("Three or more incidents occurred in the last 30 days.");
  } else if (recentIncidents.length >= 1) {
    score += 15;
    factors.push("Recent incident history detected.");
  }

  const seriousIncidents = recentIncidents.filter((incident) =>
    ["HIGH", "CRITICAL"].includes(incident.severity)
  );

  if (seriousIncidents.length > 0) {
    score += 20;
    factors.push("High-severity incident detected recently.");
  }

  // Pending workload
  if (pendingTasks >= 5) {
    score += 10;
    factors.push("High number of pending care tasks.");
  }

  // Medication load
  if (activeMedications >= 5) {
    score += 10;
    factors.push("Multiple active medications.");
  }

  score = Math.min(score, 100);

  const riskLevel = getRiskLevel(score);

  if (riskLevel === "CRITICAL" || riskLevel === "HIGH") {
    recommendations.push(
      "Prioritize resident review by care staff."
    );
  }

  if (recentIncidents.length > 0) {
    recommendations.push(
      "Review recent incident history and preventive measures."
    );
  }

  if (pendingTasks >= 5) {
    recommendations.push(
      "Review outstanding care tasks."
    );
  }

  if (activeMedications >= 5) {
    recommendations.push(
      "Review medication schedule with authorized healthcare staff."
    );
  }

  const risk = await Risk.create({
    resident: residentId,
    riskType: "OVERALL",
    score,
    riskLevel,
    factors,
    recommendations,
  });

  return risk;
};

exports.getResidentRisks = async (residentId) => {
  return await Risk.find({
    resident: residentId,
  })
    .populate(
      "resident",
      "residentId firstName lastName roomNumber"
    )
    .sort({ createdAt: -1 });
};

exports.getAllRisks = async () => {
  return await Risk.find()
    .populate(
      "resident",
      "residentId firstName lastName roomNumber"
    )
    .sort({ score: -1, createdAt: -1 });
};