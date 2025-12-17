const Joi = require("joi");

const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: true,
      allowUnknown: false,
      stripUnknown: true,
    });

    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }

    req.body = value;
    next();
  };
};

module.exports = validateRequest;
