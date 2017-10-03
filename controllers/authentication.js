const jwt = require('jwt-simple');
const User = require("../models/user");

if(process.env.NODE_ENV === "production"){
    var secret = process.env.SECRET;
  } else {
    const config = require('../config');
    var secret = config.secret;
  }

function tokenForUser(user) {
  const timestamp  = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, secret);
}

exports.generateToken = function (req, res, next) {
    req.token = tokenForUser(req.auth);
    return next();
  };

exports.sendToken = function (req, res) {
    res.setHeader('x-auth-token', req.token);
    return res.status(200).send(JSON.stringify(req.user));
  };

exports.signin = function(req, res, next) {
    const token = tokenForUser(req.user);
    const {username, email, firstName, lastName, location} = req.user;
    const user = {username, email, firstName, lastName, location};
    
    res.send({token, user});
}


exports.signup = function(req, res, next){
    const username = req.body.username;
    const firstName = req.body.fullname.firstname;
    const lastName = req.body.fullname.lastname;
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({email: email}, function(err, existingUser){
        if(err) {return next(err)};
        if(existingUser) { return res.send({error: 'Email is in use'});}

        const user = new User({username, firstName, lastName, email, password});

        user.save(function(err){
            if (err) {return next(err);}
            res.json({token: tokenForUser(user)});
        });
    });
}
