const mongoose = require("mongoose");
const url = process.env.MONGODB_URL || "";

(() => {
  mongoose
    .connect(url)
    .then(() => console.log("DB connected"))
    .catch(() => console.log("Error in db connection"));
})();

module.exports = mongoose;
