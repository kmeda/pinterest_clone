const passport = require("passport");
const User = require("../models/user");
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');
const TwitterTokenStrategy = require('passport-twitter-token');

if(process.env.NODE_ENV === "production"){
  var TWITTER_CONSUMER_KEY = process.env.TWITTER_CONSUMER_KEY;
  var TWITTER_CONSUMER_SECRET = process.env.TWITTER_CONSUMER_SECRET;
  var secret = process.env.SECRET;
} else {
  const config = require('../config');

  var secret = config.secret;
  var TWITTER_CONSUMER_KEY = config.twitterConsumerKey;
  var TWITTER_CONSUMER_SECRET = config.twitterConsumerSecret;
}


//Local Strategy
const localOptions = { usernameField: 'email'};
const localLogin = new LocalStrategy(localOptions, function(email, password, done){

  User.findOne({email: email}, function(err, user){
    if (err) { return done(err); }
    if (!user) { return done(null, false); }

    user.comparePassword(password, function(err, isMatch) {
      if (err) { return done(err); }
      if (!isMatch) { return done(null, false); }

      return done(null, user);
    });
  });
});


const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: secret
};

const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done){
  User.findById(payload.sub, function(err, user){
    if (err) {
      return done(err, false)};

    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  });
});


const twitterLogin = new TwitterTokenStrategy({
      consumerKey: TWITTER_CONSUMER_KEY,
      consumerSecret: TWITTER_CONSUMER_SECRET,
      includeEmail: true
    },
    function (token, tokenSecret, profile, done) {
      
      User.upsertTwitterUser(token, tokenSecret, profile, function(err, user) {
        return done(err, user);
      });
});


passport.use(jwtLogin);
passport.use(localLogin);
passport.use(twitterLogin);