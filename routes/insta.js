var express = require("express");
var router = express.Router();
const instagram = require("user-instagram");
const ig = require('instagram-scraping');

/* GET home page. */
router.get("/", function(req, res, next) {

  instagram("https://www.instagram.com/elbrus.bootcamp")
    .then(data => {
      console.log(`Full name is: ${data.fullName}`);
      console.log(data);
    })
    .catch(e => {
      // Error will trigger if the account link provided is false.
      console.error(data);
    });

    /* ig.scrapeTag('elbrusbootcamp').then(result => {
      console.dir(result);
    }); */

    /* ig.scrapeUserPage('elbrus.bootcamp').then(result => {
      console.dir(result);
    }); */

  res.send("Server responded");
});

module.exports = router;
