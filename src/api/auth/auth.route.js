const express = require("express");
const route = express.Router();
const authController = require("./auth.controller");
const asyncHandler = require("../../middleware/asyncHandler");
const {
  registerValidation,
  loginValidation,
} = require("../../validators/auth");
const validate = require("../../middleware/validationMiddleware");

// Create user
route.post(
  "/register",
  validate(registerValidation),
  asyncHandler(authController.registerUser)
);

// Login user
route.post(
  "/login",
  validate(loginValidation),
  asyncHandler(authController.loginUser)
);

module.exports = route;
