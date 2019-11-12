const mongoose = require("mongoose");

const keepSchema = new mongoose.Schema({
  name: String,
  id: String
});

module.exports = mongoose.model("Keep", keepSchema);
