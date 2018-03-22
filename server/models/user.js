const mongoose = require('mongoose');
const validator = require('validator');
   const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
   email: {
      type: String,
      required: true,
      minlength: 1,
      trim: true,
      unique: true,
      // validate: {
      //    validator: (value) => {
      //       validator.isEmail(value);
      //    },
      //    message: '{VALUE} is an invalid email'
      // }
// This is a simpler version of the above
      validate: {
         validator: validator.isEmail,
         message: '{VALUE} is an invalid email'
      }
   },
   password: {
      type: String,
      required: true,
      minlength: 6
   },
   tokens: [{
      access: {
         type: String,
         required: true
      },
      token: {
         type: String,
         required: true
      }
   }]
});

// methods is an object into which we can load our own methods. Don't use an arrow function as the function needs the "this" keyword

UserSchema.methods.toJSON = function () {
  var user = this;
  var userObject = user.toObject();
  const bcrypt = require('bcryptjs');

  return _.pick(userObject, ['_id', 'email']);
};

UserSchema.methods.generateAuthToken = function () {
   var user = this;
   var access = 'auth';
   var token = jwt.sign({_id: user._id.toHexString(), access}, '123abc').toString();
   user.tokens = user.tokens.concat([{access, token}]);
   // Longer version of the above
   // user.tokens = user.tokens.concat([{
   //  access: access,
   //  token: token
   // }]);

   return user.save().then(() => {
      return token;
   });
};

// Statics is for methods on the object rather than the instance
UserSchema.statics.findByToken = function (token) {
   var User = this;
   var decoded;

   try {
      decoded = jwt.verify(token, '123abc');
   } catch (e) {
      // return new Promise((resolve, reject) => {
      //    reject;
      // });
      return Promise.reject();
   }
   return User.findOne({
      '_id': decoded._id,
      'tokens.token': token,
      'tokens.access': 'auth'
   })
}

UserSchema.pre('save', function (next) {
   var user = this;
   if (user.isModified('password')) {
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(user.password, salt, (err, hash) => {
           user.password = hash;
           next();
        });
      });
   } else {
      next();
   };
})
var User = mongoose.model('User', UserSchema);

module.exports = {User}
