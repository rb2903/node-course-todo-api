const mongoose = require('mongoose');
const validator = require('validator');

var User = mongoose.model('User', {
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

module.exports = {User}
