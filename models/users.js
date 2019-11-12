const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  favouriteGroups: [],
  upcomingConcerts: [{ concertId:String, formatDate: String, group:String, date:String, location: Object},],
  previousConcerts: [{ concertId:String, formatDate: String,group:String, date:String, location: Object},],
  city: String,
  comments: [],
  recommendations: [],
  role: String,
  userPic: String
});

module.exports = mongoose.model("User", userSchema);