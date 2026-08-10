exports.validate = (validator) => {
  return (req, res, next) => {
    try {
      const result = validator(req);

      if (result && result.error) {
        return res.status(400).json({
          success: false,
          message: "Validation failed.",
          errors: result.error.details || result.error,
        });
      }

      next();
    } catch (error) {
      console.error("Validation Error:", error);

      return res.status(400).json({
        success: false,
        message: "Invalid request data.",
      });
    }
  };
};