const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt-nodejs");


//Define Model
const userSchema = new Schema({
   email: {type: String, unique: true, lowercase: true},
   password: String,
   firstName: String,
   lastName: String,
   location: String,
   username: String,
   mints: [],
   twitterProvider: {
      type: {
        id: String,
        token: String
      },
      select: false
    }
});



userSchema.pre('save', function(next){
  const user = this;

  bcrypt.genSalt(10, function(err, salt){
    if (err) { return next(err);}

    bcrypt.hash(user.password, salt, null, function(err, hash){
      if (err) { return next(err);}
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function(candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch){
    if (err) { return callback(err); }
    callback(null, isMatch);
  });
}

userSchema.statics.upsertTwitterUser = function(token, tokenSecret, profile, cb) {
  console.log("User Model", profile);
  var that = this;
    return this.findOne({
      'twitterProvider.id': profile.id
    }, function(err, user) {
      // no user was found, lets create a new one
      if (!user) {
        var newUser = new that({
          email: profile.emails[0].value,
          username: profile.username,
          firstName: profile.displayName,
          twitterProvider: {
            id: profile.id,
            token: token,
            tokenSecret: tokenSecret
          }
        });

        newUser.save(function(error, savedUser) {
          if (error) {
            console.log(error);
          }
          return cb(error, savedUser);
        });
      } else {
        return cb(err, user);
      }
    });
};

// Create the model class
const UserClass = mongoose.model('user', userSchema);

module.exports = UserClass;
