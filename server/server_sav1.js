var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp');

var Todo = mongoose.model('Todo', {
   text: {
      type: String,
      required: true,
      minlength: 1,
      trim: true
   },
   completed: {
      type: Boolean,
      default: false
   },
   completedAt: {
      type: Number,
      default: null
   }
});

var User = mongoose.model('User', {
   email: {
      type: String,
      required: true,
      minlength: 1,
      trim: true
   }
});

// var newTodo = new Todo({
//    text: 'Do something',
//    completed: false,
//    completedAt: 123
// });
//
// newTodo.save().then((doc) => {
//    console.log(JSON.stringify(doc, undefined, 2));
// }, (e) => {
//    console.log('Unable to save Todo', e);
// });

var newUser = new User({
   email: 'rob@rob.com'
});
newUser.save().then((doc) => {
   console.log(JSON.stringify(doc, undefined, 2));
}, (e) => {
   console.log('Unable to save user', e);
});
