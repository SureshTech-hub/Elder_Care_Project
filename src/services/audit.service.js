const AuditLog = require("../models/AuditLog");

exports.createAuditLog = async ({
  user,
  action,
  module,
  description = "",
  resourceId,
  resourceType,
  method,
  endpoint,
  ipAddress,
  metadata = {},
}) => {
  try {
    return await AuditLog.create({
      user,
      action,
      module,
      description,
      resourceId,
      resourceType,
      method,
      endpoint,
      ipAddress,
      metadata,
    });
  } catch (error) {
    console.error("Audit Log Error:", error.message);
    return null;
  }
};