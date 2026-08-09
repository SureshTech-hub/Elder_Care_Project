const mongoose = require("mongoose");
const AIReview = require("../models/AIReview");
const Resident = require("../models/Resident");
const { generateAIResponse } = require("../services/ai.service");

exports.generateReview = async (req, res) => {
  try {
    const {
      resident,
      input,
      category,
    } = req.body;

    if (!resident || !input) {
      return res.status(400).json({
        success: false,
        message: "resident and input are required.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(resident)) {
      return res.status(400).json({
        success: false,
        message: "Invalid resident ID.",
      });
    }

    const residentExists = await Resident.findById(resident);

    if (!residentExists) {
      return res.status(404).json({
        success: false,
        message: "Resident not found.",
      });
    }

    const prompt = `
You are an AI assistant for an elder-care operations system.

Provide a concise operational review based on the following information.

Do not make a medical diagnosis.
Do not replace a healthcare professional.

Information:
${input}
`;

    const aiResult = await generateAIResponse(prompt);

    const review = await AIReview.create({
      resident,
      input,
      response: aiResult.response,
      category: category || "GENERAL",
      createdBy: req.user._id,
    });

    const populatedReview = await AIReview.findById(review._id)
      .populate(
        "resident",
        "residentId firstName lastName roomNumber"
      )
      .populate("createdBy", "fullName email role");

    res.status(201).json({
      success: true,
      message: "AI review generated successfully.",
      aiConfigured: aiResult.success,
      data: populatedReview,
    });
  } catch (error) {
    console.error("AI Review Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while generating AI review.",
    });
  }
};

exports.getAIReviews = async (req, res) => {
  try {
    const reviews = await AIReview.find()
      .populate(
        "resident",
        "residentId firstName lastName roomNumber"
      )
      .populate("createdBy", "fullName email role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (error) {
    console.error("AI Reviews Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while fetching AI reviews.",
    });
  }
};

exports.getAIReviewById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid AI review ID.",
      });
    }

    const review = await AIReview.findById(id)
      .populate(
        "resident",
        "residentId firstName lastName roomNumber"
      )
      .populate("createdBy", "fullName email role");

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "AI review not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: review,
    });
  } catch (error) {
    console.error("AI Review Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while fetching AI review.",
    });
  }
};