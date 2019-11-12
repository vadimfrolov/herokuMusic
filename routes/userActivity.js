const express = require("express");

const router = express.Router();
const User = require('../models/users');


router.patch("/concert/previous/add/:id", async (req, res) => {
  let artist = '';

  req.body.data.performers.length < 2 ?
    artist = req.body.data.performers[0].displayName :
    artist = req.body.data.eventName;

  const data = {
    concertId: req.params.id,
    group: artist,
    date: req.body.data.eventDate,
    formatDate: req.body.data.formatDate,
    location: { lat: req.body.data.eventLocation.lat, lng: req.body.data.eventLocation.lng },
  }

  const user = await User.findById(req.body.data.userId);
  await user.previousConcerts.push(data);
  await user.save()
  req.session.user = user;
  res.json(user)
});


router.patch("/concert/previous/remove/:id", async (req, res) => {

  const user = await User.findById(req.body.user);

  const index = await user.previousConcerts.findIndex((e) => {
    return e.concertId == req.params.id
  })
  await user.previousConcerts.splice(index, 1);
  await user.save();

  req.session.user = user;
  res.json(user)
});


router.patch("/concert/upcoming/add/:id", async (req, res) => {
  let artist = '';
  req.body.data.performers.length < 2 ?
    artist = req.body.data.performers[0].displayName :
    artist = req.body.data.eventName;

  const data = {
    concertId: req.params.id,
    group: artist,
    date: req.body.data.eventDate,
    formatDate: req.body.data.formatDate,
    location: { lat: req.body.data.eventLocation.lat, lng: req.body.data.eventLocation.lng },
  }

  const user = await User.findById(req.body.data.userId);

  await user.upcomingConcerts.push(data);
  await user.save();
  req.session.user = user;
  res.json(user)
});


router.patch("/concert/upcoming/cancel/:id", async (req, res) => {

  const user = await User.findById(req.body.user);

  const index = await user.upcomingConcerts.findIndex((e) => {
    return e.concertId == req.params.id
  })
  await user.upcomingConcerts.splice(index, 1);
  await user.save();

  req.session.user = user;
  res.json(user)
});


router.patch("/artist/favorite/add/:id", async (req, res) => {

  const user = await User.findById(req.body.user.id);

  await user.favouriteGroups.push({
    id: req.params.id,
    artist: req.body.user.artist
  });
  await user.save();
  req.session.user = user;

  res.json(user)
});

router.patch("/artist/favorite/remove/:id", async (req, res) => {
  
  const user = await User.findById( req.body.user );
  
  const index = await user.favouriteGroups.findIndex((e) => {
    // console.log('lkdsnlklngdsalknjlsdk',e.id,'asnd;flndslk;ajnas', req.params.id); 
    return e.id == req.params.id
  })
  await user.favouriteGroups.splice(index, 1);
  await user.save();


  req.session.user = user;
  res.json(user)
});





module.exports = router;