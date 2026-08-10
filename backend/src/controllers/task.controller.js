const mongoose = require("mongoose");
const Task = require("../models/Task");
const Resident = require("../models/Resident");
const User = require("../models/User");

// ================= CREATE TASK =================

exports.createTask = async (req, res) => {
  try {
    const {
      resident,
      title,
      description,
      taskType,
      assignedTo,
      priority,
      dueDate,
      status,
      notes,
    } = req.body;

    if (!resident || !title || !dueDate) {
      return res.status(400).json({
        success: false,
        message: "resident, title and dueDate are required.",
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

    if (assignedTo) {
      if (!mongoose.Types.ObjectId.isValid(assignedTo)) {
        return res.status(400).json({
          success: false,
          message: "Invalid assigned user ID.",
        });
      }

      const userExists = await User.findById(assignedTo);

      if (!userExists) {
        return res.status(404).json({
          success: false,
          message: "Assigned user not found.",
        });
      }
    }

    const task = await Task.create({
      resident,
      title,
      description,
      taskType,
      assignedTo,
      priority,
      dueDate,
      status,
      notes,
      createdBy: req.user._id,
    });

    const populatedTask = await Task.findById(task._id)
      .populate(
        "resident",
        "residentId firstName lastName roomNumber status"
      )
      .populate("assignedTo", "fullName email role")
      .populate("createdBy", "fullName email role");

    return res.status(201).json({
      success: true,
      message: "Task created successfully.",
      data: populatedTask,
    });
  } catch (error) {
    console.error("Create Task Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while creating task.",
    });
  }
};

// ================= GET ALL TASKS =================

exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate(
        "resident",
        "residentId firstName lastName roomNumber status"
      )
      .populate("assignedTo", "fullName email role")
      .populate("createdBy", "fullName email role")
      .sort({ dueDate: 1 });

    return res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    console.error("Get Tasks Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching tasks.",
    });
  }
};

// ================= GET TASK BY ID =================

exports.getTaskById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID.",
      });
    }

    const task = await Task.findById(id)
      .populate(
        "resident",
        "residentId firstName lastName roomNumber status"
      )
      .populate("assignedTo", "fullName email role")
      .populate("createdBy", "fullName email role");

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    console.error("Get Task Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching task.",
    });
  }
};

// ================= GET TASKS BY RESIDENT =================

exports.getTasksByResident = async (req, res) => {
  try {
    const { residentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(residentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid resident ID.",
      });
    }

    const residentExists = await Resident.findById(residentId);

    if (!residentExists) {
      return res.status(404).json({
        success: false,
        message: "Resident not found.",
      });
    }

    const tasks = await Task.find({
      resident: residentId,
    })
      .populate(
        "resident",
        "residentId firstName lastName roomNumber status"
      )
      .populate("assignedTo", "fullName email role")
      .populate("createdBy", "fullName email role")
      .sort({ dueDate: 1 });

    return res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    console.error("Get Resident Tasks Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching resident tasks.",
    });
  }
};

// ================= UPDATE TASK =================

exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID.",
      });
    }

    const allowedFields = [
      "resident",
      "title",
      "description",
      "taskType",
      "assignedTo",
      "priority",
      "dueDate",
      "status",
      "notes",
    ];

    const updateData = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields provided for update.",
      });
    }

    if (updateData.resident) {
      if (!mongoose.Types.ObjectId.isValid(updateData.resident)) {
        return res.status(400).json({
          success: false,
          message: "Invalid resident ID.",
        });
      }

      const residentExists = await Resident.findById(updateData.resident);

      if (!residentExists) {
        return res.status(404).json({
          success: false,
          message: "Resident not found.",
        });
      }
    }

    if (updateData.assignedTo) {
      if (!mongoose.Types.ObjectId.isValid(updateData.assignedTo)) {
        return res.status(400).json({
          success: false,
          message: "Invalid assigned user ID.",
        });
      }

      const userExists = await User.findById(updateData.assignedTo);

      if (!userExists) {
        return res.status(404).json({
          success: false,
          message: "Assigned user not found.",
        });
      }
    }

    if (
      updateData.status === "COMPLETED"
    ) {
      updateData.completedAt = new Date();
    }

    const task = await Task.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    )
      .populate(
        "resident",
        "residentId firstName lastName roomNumber status"
      )
      .populate("assignedTo", "fullName email role")
      .populate("createdBy", "fullName email role");

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Task updated successfully.",
      data: task,
    });
  } catch (error) {
    console.error("Update Task Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while updating task.",
    });
  }
};

// ================= DELETE TASK =================

exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID.",
      });
    }

    const task = await Task.findByIdAndDelete(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Task deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Task Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while deleting task.",
    });
  }
};