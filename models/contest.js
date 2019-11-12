const mongoose = require("mongoose");

const contestSchema = new mongoose.Schema({
  nameOfTheContest: String,
  artist: String,
  concert: String,
  description: String,
  reward: String,
  dateDeadline: Date,
});

module.exports = mongoose.model("Contest", contestSchema);
