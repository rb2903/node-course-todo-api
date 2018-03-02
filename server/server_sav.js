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
})

// var newTodo = new Todo({
//    text: 'Cook dinner'
// });
// newTodo.save().then((doc) => {
//    console.log('Saved Todo', doc);
// }, (e) => {
//    console.log('Unable to save Todo');
// });
var newTodo2 = new Todo({
   text: 'Do something',
   completed: false,
   completedAt: 123
});
newTodo2.save().then((doc) => {
   console.log(JSON.stringify(doc, undefined, 2));
}, (e) => {
   console.log('Unable to save Todo2', e);
});
