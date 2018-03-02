var express= require('express');
var bodyParser = require('body-parser');
var {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();
app.use(bodyParser.json());// this method returns a function
app.post('/todos', (req, res) => {
   var todo = new Todo({
      text: req.body.text
   });
   todo.save().then((doc) => {
      res.send(doc);
   }, (e) => {
      res.status(400).send(e);
   });
});

app.get('/todos', (req, res) => {
   Todo.find().then((todos) => {
      res.send({todos});
   }, (e) => {
      res.status(400).send(e);
   });
});
app.get('/todos/:id', (req, res) => {
   var id = req.params.id;
   if (! ObjectID.isValid(id)) {
      return res.status(404).send();
   }
   Todo.findById(id).then((todo) => {
      if (! todo) {
         res.status(404).send();
      }
      res.status(200).send({todo});
   }).catch((e) => console.log(e));
});

app.listen(3000, () => {
   console.log('Connected on port 3000');
})

module.exports = {app};