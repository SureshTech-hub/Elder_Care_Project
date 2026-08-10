const mongoose = require("mongoose");

const forecastSchema = new mongoose.Schema(
  {
    metric: {
      type: String,
      required: true,
      trim: true,
    },

    period: {
      type: String,
      required: true,
      trim: true,
    },

    historicalValues: {
      type: [Number],
      default: [],
    },

    forecastValues: {
      type: [Number],
      default: [],
    },

    method: {
      type: String,
      default: "MOVING_AVERAGE",
    },

    confidence: {
      type: Number,
      min: 0,
      max: 1,
      default: 0,
    },

    generatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Forecast", forecastSchema);