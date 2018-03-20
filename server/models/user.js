const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

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

  return _.pick(userObject, ['_id', 'email']);
};

UserSchema.methods.generateAuthToken = function () {
   var user = this;
   var access = 'auth';
   var token = jwt.sign({_id: user._id.toHexString(), access}, '123abc').toString();
//   user.tokens = user.tokens.concat([{access}, {token}]);
   user.tokens = user.tokens.concat([{
    access: access,
    token: token
   }]);

   return user.save().then(() => {
      return token;
   });
};

var User = mongoose.model('User', UserSchema);

module.exports = {User}
