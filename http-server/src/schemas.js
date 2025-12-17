const Joi = require("joi");

const registerSchema = Joi.object({
  username: Joi.string().min(4).required().messages({
    "string.base": "Username must be text.",
    "string.min": "Username must have at least 4 characters.",
    "string.empty": "Username cannot be empty.",
    "any.required": "Username is a required field.",
  }),

  password: Joi.string().min(4).required().messages({
    "string.min": "Password is too short (minimum 4 characters).",
    "string.empty": "Password cannot be empty.",
    "any.required": "Password is a required field.",
  }),

  email: Joi.string().email().required().messages({
    "string.email": "Invalid email address format (e.g., example@mail.com).",
    "string.empty": "E-mail cannot be empty.",
    "any.required": "Email address is a required field.",
  }),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Invalid email address format.",
    "string.empty": "Email cannot be empty.",
    "any.required": "Email address is required.",
  }),

  password: Joi.string().required().messages({
    "string.empty": "Password cannot be empty.",
    "any.required": "Password is required.",
  }),
});

const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Invalid email address format.",
    "string.empty": "Email cannot be empty.",
    "any.required": "Email address is required for password recovery.",
  }),
});

const resetPasswordSchema = Joi.object({
  token: Joi.string().required().messages({
    "any.required": "Token is required to reset the password.",
  }),

  newPassword: Joi.string().min(4).required().messages({
    "string.min": "New password is too short (minimum 4 characters).",
    "any.required": "New password is required.",
  }),
});

module.exports = {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
};
