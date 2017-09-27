const path = require('path');
const Authentication = require("./controllers/authentication");
const updateUser = require("./controllers/updateUser");
const passport = require('passport');
const passportService = require('./services/passport');

const requireAuth = passport.authenticate('jwt', {session: false});
const requireSignin = passport.authenticate('local', {session: false});

module.exports = function(app) {

  app.post('/signin_user', requireSignin, Authentication.signin);
  app.post('/signup_user', Authentication.signup);

  app.post('/update_user', updateUser.update);
  app.get('/get_user', updateUser.fetchUser);

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
  });
}
