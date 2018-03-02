const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
var {ObjectID} = require('mongodb');

var id = '5a96d709967b814c1f86b2f4';

if (! ObjectID.isValid(id)) {
   console.log('Id not valid');
}

// Note that we don't need to pass an ObjectId into find - Mongoose converts it for us
// Todo.find({
//    _id: id
// }).then((todos) => {
//    console.log('Todos', todos);
// });
//
// Todo.findOne({
//    _id: id
// }).then((todo) => {
//    console.log('Todo', todo);
// })

Todo.findById(id).then((todo) => {
   if (! todo) {
      return console.log('Not found');
   }
   console.log('Todo by Id', todo);
}).catch((e) => console.log(e));
