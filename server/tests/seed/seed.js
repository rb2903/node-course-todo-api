const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');
const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const users = [{
   _id: userOneId,
   email: 'rob@coolbreeze.co.uk',
   password: 'password1',
   tokens: [{
      access: 'auth',
      token: jwt.sign({_id: userOneId.toHexString(), access: 'auth'}, '123abc').toString()
   }]
}, {
   _id: userTwoId,
   email: 'fred@coolbreeze.co.uk',
   password: 'password2'
}];

const todos = [{
   _id: new ObjectID(),
   text: 'First test todo'
}, {
   _id: new ObjectID(),
   text: 'Second test todo',
   completed: true,
   completedAt: 333
}];

const populateTodos = (done) => {
   Todo.remove({}).then(() => {
      return Todo.insertMany(todos);
   }).then(() => done());
};

const populateUsers = (done) => {
   User.remove({}).then(() => {
      var userOne = new User(users[0]).save();
      var userTwo = new User(users[1]).save();
      return Promise.all([userOne, userTwo]);
   }).then(() => done());
};

module.exports = {todos, populateTodos, users, populateUsers};
