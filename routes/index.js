var express = require("express");
const fetch = require("node-fetch");
const axios = require("axios");
require("dotenv").config();
var router = express.Router();

let SongKickKey = process.env.SONGKICK_KEY;
let LastFmKey = process.env.LASTFM_KEY;
let YouTubeKey = process.env.YOUTUBE_API_KEY_THIRD;

const Artist = require("../models/artist");
const Concert = require("../models/concert");
const Keep = require("../models/keep");

router.post("/getId", async (req, res) => {
  let bandInput = encodeURIComponent(`${req.body.text}`);
  const resID = await fetch(
    `https://api.songkick.com/api/3.0/search/artists.json?apikey=${SongKickKey}&query=${bandInput}`
  );
  const dataID = await resID.json();

  const id = dataID.resultsPage.results.artist[0].id;

  res.json({ id });
});

router.post("/search", async (req, res) => {
  let artistinput = req.body.text.toLowerCase();
  let bandInput = encodeURIComponent(`${req.body.text}`);
  const resSearch = await fetch(
    `http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${bandInput}&api_key=${LastFmKey}&format=json`
  );
  const dataSearch = await resSearch.json();
  const resPic = await fetch(
    `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&q=${bandInput}&key=${YouTubeKey}`
  );
  const pic = await resPic.json();
  const topTracksApiCall = await axios.get(
    `http://ws.audioscrobbler.com/2.0/?method=artist.gettoptracks&artist=${bandInput}&api_key=${LastFmKey}&format=json`
  );

  dataSearch.topTracks = topTracksApiCall.data.toptracks.track.slice(0, 10);
  const artistComment = await Artist.findOne({ nameArtist: artistinput });
  if (!artistComment) {
    res.json({ dataSearch, pic, artistComment: [] });
  } else {
    res.json({ dataSearch, pic, artistComment: artistComment.comments });
  }
});

router.get("/concert/:id", async (req, res) => {
  let concertId = req.params.id;
  const resConcertInfo = await fetch(
    `https://api.songkick.com/api/3.0/events/${concertId}.json?apikey=${SongKickKey}`
  );
  const ConcertInfo = await resConcertInfo.json();
  const info = ConcertInfo.resultsPage.results.event;

  const commentsConcert = await Concert.findOne({ idConcert: concertId });
  if (!commentsConcert) {
    res.json({ info, commentsConcert: [] });
  } else {
    res.json({ info, commentsConcert: commentsConcert.comments });
  }
});

// коменты на странице концерта
router.post("/comments", async (req, res) => {
  let { nameArtists, idConcert, comments } = req.body.comment;

  const concert = await Concert.findOne({ idConcert });
  if (!concert) {
    const newConcert = new Concert({
      nameArtists: nameArtists,
      idConcert,
      comments: [comments],
      attendees: null,
      photos: null
    });
    await newConcert.save();
  } else {
    await Concert.updateOne(
      { idConcert: idConcert },
      { $push: { comments: [comments] } }
    );
  }
  const concerts = await Concert.findOne({ idConcert });
  res.json({ concerts });
});

//коменты на странице артиста
router.post("/commentsar", async (req, res) => {
  let { nameArtist, idArtist, comments } = req.body.comment;

  const artist = await Artist.findOne({ idArtist });
  if (!artist) {
    const newArttist = new Artist({
      nameArtist: nameArtist.toLowerCase(),
      idArtist: idArtist,
      comments: [comments],
      favourites: []
    });
    await newArttist.save();
  } else {
    await Artist.updateOne({ idArtist }, { $push: { comments: [comments] } });
  }
  const commentsArtist = await Artist.findOne({ idArtist });

  res.json({ commentsArtist });
});

//на будующее концеты
router.post("/upcoming", async (req, res) => {
  const artistId = req.body.id;
  const resCon = await fetch(
    `https://api.songkick.com/api/3.0/artists/${artistId}/calendar.json?apikey=${SongKickKey}`
  );

  const dataConcert = await resCon.json();

  res.json({ dataConcert });
});

router.get("/artists/:id", async (req, res) => {
  const bandId = req.params.id;
  const resConcerts = await fetch(
    `https://api.songkick.com/api/3.0/artists/${bandId}/calendar.json?apikey=${SongKickKey}&per_page=5`
  );
  const dataConcerts = await resConcerts.json();
  res.json({ dataConcerts });
});

router.get("/explore/:page", async (req, res) => {
  const page = req.params.page;
  const resExplore = await fetch(
    `https://api.songkick.com/api/3.0/metro_areas/32051/calendar.json?apikey=${SongKickKey}&page=${page}`
  );
  const dataExplore = await resExplore.json();
  res.json({ dataExplore });
});

router.post("/explore/:date", async (req, res) => {
  let date = req.body.formattedDate;
  const resDate = await fetch(
    `https://api.songkick.com/api/3.0/metro_areas/32051/calendar.json?apikey=${SongKickKey}&min_date=${date}&max_date=${date}`
  );
  const dataDate = await resDate.json();
  res.json({ dataDate });
});

router.post("/delete/:comment/:idArtist", async (req, res) => {
  const { comment, idArtist } = req.params;
  const artist = await Artist.findOne({ idArtist });
  const indexComment = await artist.comments.findIndex(e => {
    return e._id == comment;
  });
  await artist.comments.splice(indexComment, 1);
  await artist.save();
  const commentsArtist = await Artist.findOne({ idArtist });
  res.json({ commentsArtist });
});

router.post("/remove/:comment/:idConcert", async (req, res) => {
  const { comment, idConcert } = req.params;
  const concert = await Concert.findOne({ idConcert });

  const indexComment = await concert.comments.findIndex(e => {
    return e._id == comment;
  });

  await concert.comments.splice(indexComment, 1);
  await concert.save();
  const commentsConcert = await Concert.findOne({ idConcert });
  res.json({ commentsConcert });
})

router.post("/keepName", async (req, res) => {
  const { name, id } = req.body;
  const newKeep = new Keep({
    name: name,
    id: id
  });

  await newKeep.save();
  res.end();
});

router.post("/getName", async (req, res) => {
  const { id } = req.body;
  const fetchedKeep = await Keep.findOne({ id });
  const fetchedName = fetchedKeep.name;
  console.log(12345, fetchedName);
  res.json({fetchedName});
});

module.exports = router;
