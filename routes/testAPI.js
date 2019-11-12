var express = require("express");
var router = express.Router();
const User = require("../models/users");

router.get("/", async function(req, res, next) {
    const currentUser = await User.find( {username:req.session.user.username})

    res.json(currentUser[0]);
});

module.exports = router;