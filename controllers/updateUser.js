const User = require("../models/user");
const passport = require("passport");
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');
const uuidv1 = require('uuid/v1');

if (process.env.NODE_ENV === 'production') {
  var secret = process.env.SECRET
} else {
  const config = require('../config');
  var secret = config.secret;
}


exports.checkUsername = (req, res, next) => {
  const username = req.query.username;
  User.findOne({username: username}, (err, user)=>{
    if(err) {return next(err)};
    if(user){
      res.send("username taken");
    } else {
      res.send("username available");
    }
  });
}

exports.update = function(req, res, next){

    const email = req.body.email;
    const {firstName, lastName, location} = req.body;

    User.findOne({email}, function(err, user){

        if(err) {return next(err)};

        if(user) {
          User.update({email: email}, { firstName, lastName, location }).then(function(response){
            res.send({firstName, lastName, location});
          });
        }
    });
}

exports.fetchUser = function(req, res, next) {
  const {username, email, firstName, lastName, location} = req.user;
  const user = {username, email, firstName, lastName, location};

  res.send({user});
}

exports.saveMints = (req, res, next) => {
  const email = req.user.email;
  const username = req.user.username;
  const url = req.body.imageURL;
  const title = req.body.title;
  var timestamp = new Date();

  var mint = {uid: uuidv1(), url, title, username, likes: [], timestamp: timestamp.getTime()};

    User.update({email}, { $addToSet: {mints : mint}}).then(()=>{
      User.findOne({email}, (err, user)=>{
        res.send(user.mints);
      })
  }).catch((e)=>console.log(e));
}

exports.fetchMyMints = (req, res, next) => {
  var {mints} = req.user;
  res.send({mints});
}

exports.fetchAllMints = (req, res, next) => {

  User.find({}).then((results)=>{
    var mints = results.map((each)=> {
      if (each.mints.length > 0) {
        return each.mints;
      }
    });
    res.send(mints);
  });
}

exports.deleteMint = (req, res, next) => {
  var {uid} = req.body;
  var {email} = req.user;

  User.update({email}, {$pull: {mints: {uid}}}).then(function(){
    User.findOne({email}, (err, user)=>{
      res.send(user.mints);
    })
  }).catch((e) => {console.log(e)});
}

exports.thisUserMints = (req, res, next) => {
  var {username} = req.query;

  User.findOne({username}, (err ,user)=> {
    if (err) {console.log(err)}
    if (user) {
      res.send(user.mints);
    }
  });
  }

exports.addLike = (req, res, next) => {
  var {username, uid} = req.body;
  var user_liked = req.user.username;

  User.findOneAndUpdate( {username, 'mints.uid': uid}, {$push : { 'mints.$.likes' : user_liked }}).then(() => {
    res.send("success");
  }).catch((e) => {console.log(e)});

}

exports.removeLike = (req, res, next) => {
  var {username, uid} = req.body;
  var user_liked = req.user.username;

  User.findOneAndUpdate( {username, 'mints.uid': uid}, {$pull : { 'mints.$.likes' : user_liked }}).then(() => {
    res.send("success");
  }).catch((e) => {console.log(e)});

}



// db.users.findOneAndUpdate( {'username': 'wolfy', 'mints.uid': '77ee1da0-a7e6-11e7-98e3-41d0e208d9b3'}, {$push : { 'mints.$.likes' : 'wolfgang' }})
