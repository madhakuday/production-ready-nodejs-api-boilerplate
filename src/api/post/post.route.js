const express = require("express");
const route = express.Router();
const postController = require("./post.controller");
const asyncHandler = require("../../middleware/asyncHandler");
const validate = require("../../middleware/validationMiddleware");
const { createPostValidation } = require("../../validators/post");

// Get all Post
route.get("/", asyncHandler(postController.getAllPost));

// Create Pots
route.post(
  "/",
  validate(createPostValidation),
  asyncHandler(postController.createPost)
);

module.exports = route;
