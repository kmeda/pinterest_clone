const path = require('path');
const axios = require('axios');
const request = require('request');
const CircularJSON = require('circular-json');
const Authentication = require("./controllers/authentication");
const updateUser = require("./controllers/updateUser");
const passport = require('passport');
const passportService = require('./services/passport');

if(process.env.NODE_ENV === "production"){
  var TWITTER_CONSUMER_KEY = process.env.TWITTER_CONSUMER_KEY;
  var TWITTER_CONSUMER_SECRET = process.env.TWITTER_CONSUMER_SECRET;
} else {
  const config = require('./config');
  var TWITTER_CONSUMER_KEY = config.twitterConsumerKey;
  var TWITTER_CONSUMER_SECRET = config.twitterConsumerSecret;
}

const requireAuth = passport.authenticate('jwt', {session: false});
const requireSignin = passport.authenticate('local', {session: false});
const twitterSignIn = passport.authenticate('twitter-token', {session: false});

module.exports = function(app) {

  app.post('/signin_user', requireSignin, Authentication.signin);
  app.post('/signup_user', Authentication.signup);

  app.post('/auth/twitter/reverse', function(req, res) {
    request.post({
      url: 'https://api.twitter.com/oauth/request_token',
      oauth: {
        oauth_callback: "http%3A%2F%2Flocalhost%3A3000%2Ftwitter-callback",
        consumer_key: TWITTER_CONSUMER_KEY,
        consumer_secret: TWITTER_CONSUMER_SECRET
      }
    }, function (err, r, body) {
      if (err) {
        return res.send(500, { message: e.message });
      }

      var jsonStr = '{ "' + body.replace(/&/g, '", "').replace(/=/g, '": "') + '"}';
      
      res.send(JSON.parse(jsonStr));
    });
  });


  
  app.post('/auth/twitter', (req, res, next) => {
    
    request.post({
      url: `https://api.twitter.com/oauth/access_token?oauth_verifier`,
      oauth: {
        consumer_key: TWITTER_CONSUMER_KEY,
        consumer_secret: TWITTER_CONSUMER_SECRET,
        token: req.query.oauth_token
      },
      form: { oauth_verifier: req.query.oauth_verifier }
    }, function (err, r, body) {
      if (err) {
        return res.send(500, { message: e.message });
      }

      const bodyString = '{ "' + body.replace(/&/g, '", "').replace(/=/g, '": "') + '"}';
      const parsedBody = JSON.parse(bodyString);

      req.body['oauth_token'] = parsedBody.oauth_token;
      req.body['oauth_token_secret'] = parsedBody.oauth_token_secret;
      req.body['user_id'] = parsedBody.user_id;

      next();
    });
  }, passport.authenticate('twitter-token', {session: false}), function(req, res, next) {
      if (!req.user) {
        return res.send(401, 'User Not Authenticated');
      }
      console.log(req.user);
      // prepare token for API
      req.auth = {
        id: req.user.id
      };

      return next();
}, Authentication.generateToken, Authentication.sendToken);

  app.post('/update_user', updateUser.update);
  app.get('/get_user', updateUser.fetchUser);

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
  });
}
