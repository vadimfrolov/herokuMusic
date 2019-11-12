const fb = require('./fb')
const google = require('./google')
const User = require('../models/users');

module.exports = (passport) => {
  
  // Passport needs to be able to serialize and deserialize users to support persistent login sessions
  passport.serializeUser(function (user, done) {
    done(null, user._id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  })
  
  fb(passport)
  // google(passport)
} 
