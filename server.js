const express = require('express');
const path = require('path');
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");
const axios = require("axios");
const favicon = require('serve-favicon');
const session = require('express-session');
const passport = require('passport');
var Router = require("./router.js");

const app = express();
const PORT = process.env.PORT || 3050;

if (process.env.NODE_ENV === "production") {
  var mongodbURI = process.env.MONGODBURI;
} else {
  const config = require('./config');
  var mongodbURI = config.mongodbURI;
  var secret = config.secret;
}

app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: process.env.SECRET || secret
}));

var io = require('socket.io').listen(app.listen(PORT));

mongoose.connect(mongodbURI, {useMongoClient: true});

app.use(morgan('combined'));
app.use(cors());
app.use(bodyParser.json({type: '*/*'}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(favicon(path.join(__dirname + '/favicon.ico')));
app.use(express.static('dist'));
app.use(passport.initialize());
app.use(passport.session());

io.sockets.on('connection', function (socket) {

  console.log('client connected');

    // Setup events here

    socket.on('on_add_mint', ()=>{
      io.emit('fetch_all_mints');
    });

    socket.on('on_delete_mint', ()=>{
      io.emit('fetch_all_mints');
    });

    socket.on('on_user_liked', ()=>{
      io.emit('fetch_all_mints');
      io.emit('fetch_my_mints');
      io.emit('fetch_this_user_mints');
    });

    socket.on('on_user_disliked', ()=>{
      io.emit('fetch_all_mints');
      io.emit('fetch_my_mints');
      io.emit('fetch_this_user_mints');
    });


});

Router(app);

console.log(`Server listening at port ${PORT}`);
