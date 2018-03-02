const {mongoose} = require('./../server/db/mongoose');
const {User} = require('./../server/models/user');
var {ObjectID} = require('mongodb');

User.findById('5a9430bf2578a7c80c6fdf85').then((user) => {
   if (! user) {
      return console.log('Not found');
   }
   console.log(JSON.stringify(user, undefined, 2));
}).catch((e) => console.log(e));
