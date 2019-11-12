const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const artistSchema = new mongoose.Schema({
  nameArtist: String,
  idArtist:String,
  comments: [
    { nameUser: String, idUser: String, text: String, date: String }
  ],
 favourites:[{ nameUser: String, idUser: ObjectId}]
});

module.exports = mongoose.model("Artist", artistSchema);
