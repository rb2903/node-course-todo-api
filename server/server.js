const express= require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const _ = require('lodash');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();
const port = process.env.PORT || 3000;

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
   if (ObjectID.isValid(id)) {
      return res.status(404).send();
   }
   Todo.findById(id).then((todo) => {
      if (! todo) {
         res.status(404).send(id);
      }
      res.status(200).send({todo});
   }).catch((e) => res.status(400).send());
});

app.delete('/todos/:id', (req, res) => {
   var id = req.params.id;
   if (! ObjectID.isValid(id)) {
      return res.status(404).send();
   }
   Todo.findByIdAndRemove(id).then((todo) => {
      if (! todo) {
         res.status(404).send();
      }
      res.status(200).send({todo});
   }).catch((e) => res.status(400).send());
});

app.patch('/todos/:id', (req, res) => {
   var id = req.params.id;
// Only allow user to update certain properties (eg completedAt is not user-updateable)
   var body =_.pick(req.body, ['text', 'completed']);
   if (! ObjectID.isValid(id)) {
      return res.status(404).send();
   }
   if (isBoolean(body.completed) && body.completed) {
      body.completedAt = new Date().getTime();// timestamp
   } else {
      body.completed = false;
      body.completedAt = null;
   }
   // new return updated rec - similar to returnOriginal: false in findOneAndUpdate
   Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
      if (! todo) {
         return res.status(404).send();
      }
      return res.send({todo});
   }).catch((e) => res.status(400).send());
});

app.listen(port, () => {
   console.log(`server is up on port ${port}`);
});

module.exports = {app};
