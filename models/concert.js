const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const concertSchema = new mongoose.Schema({
  nameArtists: [],
  idConcert: String,
  comments: [
    { nameUser: String, idUser: String, text: String, date: String }
  ],
  attendees: [{ nameUser: String, idUser: ObjectId }],
  photos: [
    {
      nameUser: String,
      idUser: ObjectId,
      image: Buffer
    }
  ]
});

module.exports = mongoose.model("Concert", concertSchema);
