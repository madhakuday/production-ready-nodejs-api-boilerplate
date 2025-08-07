const express = require("express");
const route = express.Router();

// -- Route imports
const authRoutes = require("./auth/auth.route");
const userRoutes = require("./user/user.route");
const postRoutes = require("./post/post.route");

// -- Route imports

// Auth
route.use("/auth", authRoutes);

// User
route.use("/users", userRoutes);

// Post
route.use("/posts", postRoutes);

module.exports = route;
