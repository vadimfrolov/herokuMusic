require('dotenv').config();
let GOOGLE_CONSUMER_KEY = process.env.REACT_GOOGLE_OAUTH_KLIENT_ID_KEY;
let GOOGLE_CONSUMER_SECRET = process.env.REACT_GOOGLE_OAUTH_KLIENT_SECRET;
const User = require('../models/users');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuthStrategy;


// Use the GoogleStrategy within Passport.
//   Strategies in passport require a `verify` function, which accept
//   credentials (in this case, a token, tokenSecret, and Google profile), and
//   invoke a callback with a user object.
module.exports = (passport) => {

  passport.use(new GoogleStrategy({    
    consumerKey: GOOGLE_CONSUMER_KEY,
    consumerSecret: GOOGLE_CONSUMER_SECRET,
    callbackURL: "http://localhost:9000/auth/google/callback"
  },
    
    
    async (token, tokenSecret, profile, done) => {
      
      const user = User.findOne({ googleId: profile.id });
      if (user) {
        return done(null, user); // user found, return that user
      } else {
        // if there is no user found with that facebook id, create them


        const newUser = new User(
          {
            googleId: profile.id,
            password: token,
          })
        // save our user to the database
        await newUser.save(function (err) {
          if (err)
            throw err;
          return done(null, newUser);
        });
      }

    }
  ));
}