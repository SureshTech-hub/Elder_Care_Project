const Incident = require("../models/Incident");
const Task = require("../models/Task");
const Medication = require("../models/Medication");
const Anomaly = require("../models/Anomaly");

const getSeverity = (deviation) => {
  if (deviation >= 75) return "CRITICAL";
  if (deviation >= 50) return "HIGH";
  if (deviation >= 25) return "MEDIUM";
  return "LOW";
};

const calculateDeviation = (value, baseline) => {
  if (baseline === 0) {
    return value > 0 ? 100 : 0;
  }

  return Math.round(
    Math.abs((value - baseline) / baseline) * 100
  );
};

exports.detectOperationalAnomalies = async () => {
  const [
    totalIncidents,
    pendingTasks,
    activeMedications,
  ] = await Promise.all([
    Incident.countDocuments(),
    Task.countDocuments({
      status: { $in: ["PENDING", "IN_PROGRESS"] },
    }),
    Medication.countDocuments({
      status: "ACTIVE",
    }),
  ]);

  /*
   * These are operational baselines for the first
   * version of the local anomaly engine.
   *
   * Later, these can be replaced by historical
   * rolling averages from the database.
   */
  const metrics = [
    {
      metric: "INCIDENT_COUNT",
      value: totalIncidents,
      baseline: 5,
      description:
        "Total number of incidents compared with the expected operational baseline.",
    },
    {
      metric: "PENDING_TASKS",
      value: pendingTasks,
      baseline: 10,
      description:
        "Pending and in-progress tasks compared with the expected workload baseline.",
    },
    {
      metric: "ACTIVE_MEDICATIONS",
      value: activeMedications,
      baseline: 20,
      description:
        "Active medications compared with the expected medication workload baseline.",
    },
  ];

  const anomalies = [];

  for (const item of metrics) {
    const deviation = calculateDeviation(
      item.value,
      item.baseline
    );

    if (deviation >= 25) {
      const severity = getSeverity(deviation);

      const anomaly = await Anomaly.create({
        metric: item.metric,
        value: item.value,
        baseline: item.baseline,
        deviation,
        severity,
        description: item.description,
      });

      anomalies.push(anomaly);
    }
  }

  return anomalies;
};

exports.getAllAnomalies = async () => {
  return await Anomaly.find()
    .populate(
      "resident",
      "residentId firstName lastName roomNumber"
    )
    .sort({
      createdAt: -1,
    });
};

exports.getOpenAnomalies = async () => {
  return await Anomaly.find({
    status: "OPEN",
  })
    .populate(
      "resident",
      "residentId firstName lastName roomNumber"
    )
    .sort({
      severity: -1,
      createdAt: -1,
    });
};

exports.updateAnomalyStatus = async (
  anomalyId,
  status
) => {
  return await Anomaly.findByIdAndUpdate(
    anomalyId,
    { status },
    {
      new: true,
      runValidators: true,
    }
  ).populate(
    "resident",
    "residentId firstName lastName roomNumber"
  );
};