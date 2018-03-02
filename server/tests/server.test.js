const request = require('supertest');
const expect = require('expect');

//var app = require('./../server').app;// ie importing server.js
const {app} = require('./../server');// does same as above
const {Todo} = require('./../models/todo');
var {ObjectID} = require('mongodb');

const todos = [{
   _id: new ObjectID(),
   text: 'First test todo'
}, {
   _id: new ObjectID(),
   text: 'Second test todo'
}];
// This version inserts our test data when the db has been cleared
beforeEach((done) => {
   Todo.remove({}).then(() => {
      return Todo.insertMany(todos);
   }).then(() => done());
});

describe('POST /todos', () => {
   it('should create a new todo', (done) => {
      var text = 'Test todo text';
      request(app)
         .post('/todos')
         .send({text})
         .expect(200)
         .expect((res) => {
            expect(res.body.text).toBe(text);
         })
         .end((err, res) => {
            if (err) {
               return done(err);
            }
            Todo.find({text}).then((todos) => {
               expect(todos.length).toBe(1);// ie 1 entry in db
               expect(todos[0].text).toBe(text)
               done();
            }).catch((e) => done(e));
         });
   });

   it('should not create todo with invalid data', (done) => {
      request(app)
         .post('/todos')
         .send({})
         .expect(400)
         .end((err, res) => {
            if (err) {
               return done(err);
            }
            Todo.find().then((todos) => {
               expect(todos.length).toBe(2);// ie nothing in db
               done();
            }).catch((e) => done(e));
         });
   });
});

describe('GET /todos', () => {
   it('should find all todos', (done) => {
      request(app)
         .get('/todos')
         .expect(200)
         .expect((res) => {
            expect(res.body.todos.length).toBe(2);
         })
         .end(done);
   });
});

describe('GET /todos/:id', () => {
   it('should return todo', (done) => {
      request(app)
         .get(`/todos/${todos[0]._id.toHexString()}`)
         .expect(200)
         .expect((res) => {
            expect(res.body.todo.text).toBe(todos[0].text);
         })
         .end(done);
   });
   it('should return return 404 if not found', (done) => {
      var id = new ObjectID();
      request(app)
         .get(`/todos/${id.toHexString()}`)
         .expect(404)
         .end(done);
   });
   it('should return return 404 if invalid id', (done) => {
      request(app)
         .get(`/todos/123`)
         .expect(404)
         .end(done);
   });
});
