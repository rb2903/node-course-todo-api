const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
var {ObjectID} = require('mongodb');

// Todo.remove({}).then((res) => {
//    console.log(res);
// });
//
// This queries by one or more properties of the collection objec (eg id or text)
// Todo.findOneAndRemove({_id: '5a996029b279231d6cd03f4d'}).then((res) => {
//    console.log(res);
// });

Todo.findByIdAndRemove('5a996029b279231d6cd03f4d').then((todo) => {
   console.log(todo);
});
