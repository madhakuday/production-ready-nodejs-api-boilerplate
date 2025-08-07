const express = require("express");
const route = express.Router();
const userController = require("./user.controller");
const asyncHandler = require("../../middleware/asyncHandler");
const { faker } = require("@faker-js/faker");
const User = require("./user.model");

// Get all User
route.get("/", asyncHandler(userController.getAllUsers));

route.get("/seed", async (req, res) => {
  try {
    console.time("test");
    const users = [];

    // Step 1: Delete all existing users
    await User.deleteMany({});
    console.log("All existing users deleted.");

    for (let i = 0; i < 10000; i++) {
      users.push({
        name: faker.person.fullName(),
        email:
          faker.internet
            .email()
            .toLowerCase()
            .replace(/[^a-z0-9@.]/g, "") + `_${i}`, // Ensure uniqueness
        password: faker.internet.password(),
        userType: "customer", // or vendor/admin if needed
      });
    }

    await User.insertMany(users);

    console.timeEnd("test");
    res.status(201).json({
      success: true,
      message: "10,000 users inserted successfully",
    });
  } catch (error) {
    console.error("Seed error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to insert users",
    });
  }
});

module.exports = route;
