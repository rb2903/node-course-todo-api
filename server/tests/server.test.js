const request = require('supertest');
const expect = require('expect');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');// does same as above
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
   it('should create a new todo', (done) => {
      var text = 'Test todo text';
      request(app)
         .post('/todos')
         .set('x-auth', users[0].tokens[0].token)// ie send header
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
         .set('x-auth', users[0].tokens[0].token)
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
         .set('x-auth', users[0].tokens[0].token)
         .expect(200)
         .expect((res) => {
            expect(res.body.todos.length).toBe(1);
         })
         .end(done);
   });
});

describe('GET /todos/:id', () => {
   it('should return todo', (done) => {
      request(app)
         .get(`/todos/${todos[0]._id.toHexString()}`)
         .set('x-auth', users[0].tokens[0].token)
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
         .set('x-auth', users[0].tokens[0].token)
         .expect(404)
         .end(done);
   });

   it('should return return 404 if invalid id', (done) => {
      request(app)
         .get(`/todos/123`)
         .set('x-auth', users[0].tokens[0].token)
         .expect(404)
         .end(done);
   });
   it('should not return todo created by another user', (done) => {
      request(app)
         .get(`/todos/${todos[1]._id.toHexString()}`)
         .set('x-auth', users[0].tokens[0].token)
         .expect(404)
         .end(done);
   });

});

describe('DELETE /todos/:id', () => {
   it('should remove todo', (done) => {
      var hexId = todos[1]._id.toHexString();
      request(app)
         .delete(`/todos/${hexId}`)
         .set('x-auth', users[1].tokens[0].token)
         .expect(200)
         .expect((res) => {
            expect(res.body.todo._id).toBe(hexId);
         })
         .end((err, res) => {
            if (err) {
               return done(err);
            }
            Todo.findById(hexId).then((todo) => {
               expect(todo).toBeFalsy();
               done();
            }).catch((e) => done(e));
         });
   });

   it('should return return 404 if not found', (done) => {
      var id = new ObjectID();
      request(app)
         .delete(`/todos/${id.toHexString()}`)
         .set('x-auth', users[1].tokens[0].token)
         .expect(404)
         .end(done);
   });

   it('should return return 404 if invalid id', (done) => {
      request(app)
         .delete(`/todos/123`)
         .set('x-auth', users[1].tokens[0].token)
         .expect(404)
         .end(done);
   });

   it('should not remove todo create by another user', (done) => {
      var hexId = todos[1]._id.toHexString();
      request(app)
         .delete(`/todos/${hexId}`)
         .set('x-auth', users[0].tokens[0].token)
         .expect(404)
         .end((err, res) => {
            if (err) {
               return done(err);
            }
            Todo.findById(hexId).then((todo) => {
               expect(todo).toBeTruthy();
               done();
            }).catch((e) => done(e));
         });
   });
});

describe('PATCH /todos/:id', () => {
   it('should update todo', (done) => {
      var hexId = todos[0]._id.toHexString();
      var text = 'Updated text for first todo';
      request(app)
         .patch(`/todos/${hexId}`)
         .set('x-auth', users[0].tokens[0].token)
         .send({
           completed: true,
           text
         })
         .expect(200)
         .expect((res) => {
            expect(res.body.todo.text).toBe(text);
            expect(res.body.todo.completed).toBe(true);
            // expect(res.body.todo.completedAt).toBeA('number');
            expect(typeof res.body.todo.completedAt).toBe('number');
         })
         .end((err, res) => {
            if (err) {
               return done(err);
            }
            Todo.find({text}).then((todos) => {
               expect(todos[0].text).toBe(text)
               done();
            }).catch((e) => done(e));
      });
   });

   it('should clear completedAt when todo not completed', (done) => {
      var hexId = todos[1]._id.toHexString();
      var text = 'Updated text for second todo';
      request(app)
         .patch(`/todos/${hexId}`)
         .set('x-auth', users[1].tokens[0].token)
         .send({
           completed: false,
           text
         })
         .expect(200)
         .expect((res) => {
            expect(res.body.todo.text).toBe(text);
            expect(res.body.todo.completed).toBe(false);
            expect(res.body.todo.completedAt).toBeFalsy();
         })
         .end((err, res) => {
            if (err) {
               return done(err);
            }
            Todo.find({text}).then((todos) => {
               expect(todos[0].text).toBe(text)
               done();
            }).catch((e) => done(e));
         });
   });

   it('should return 404 if invalid id', (done) => {
      request(app)
         .patch(`/todos/123`)
         .set('x-auth', users[1].tokens[0].token)
         .expect(404)
         .end(done);
   });

   it('should not update todo created by another user', (done) => {
      var hexId = todos[0]._id.toHexString();
      var text = 'Updated text for first todo';
      request(app)
         .patch(`/todos/${hexId}`)
         .set('x-auth', users[0].tokens[0].token)
         .send({
           completed: true,
           text
         })
         .expect(200)
         .expect((res) => {
            expect(res.body.todo.text).toBe(text);
            expect(res.body.todo.completed).toBe(true);
            // expect(res.body.todo.completedAt).toBeA('number');
            expect(typeof res.body.todo.completedAt).toBe('number');
         })
         .end((err, res) => {
            if (err) {
               return done(err);
            }
            Todo.find({text}).then((todos) => {
               expect(todos[0].text).toBe(text)
               done();
            }).catch((e) => done(e));
      });
   });
});

describe('GET /users/me', () => {
   it('should return user if authenticated', (done) => {
     request(app)
       .get('/users/me')
       .set('x-auth', users[0].tokens[0].token)// ie send header
       .expect(200)
       .expect((res) => {
         expect(res.body._id).toBe(users[0]._id.toHexString());
         expect(res.body.email).toBe(users[0].email);
       })
       .end(done);
   });

   it('should return 401 if not authenticated', (done) => {
     request(app)
       .get('/users/me')
       .expect(401)
       .expect((res) => {
         expect(res.body).toEqual({});// similar to toBe but works on objects
       })
       .end(done);
   });
});

describe('POST /users', () => {
   it('should create a user', (done) => {
      var email = 'me@coolbreeze.co.uk';
      var password = 'password1';
      request(app)
       .post('/users')
       .send({email, password})
       .expect(200)
       .expect((res) => {
         expect(res.headers['x-auth']).toBeTruthy();
         expect(res.body._id).toBeTruthy();
         expect(res.body.email).toBe(email);
       })
       .end((err, res) => {
          if (err) {
             return done(err);
          }
          User.findOne({email}).then((user) => {
             expect(user).toBeTruthy()
             expect(user.password).not.toBe(password)// ie must be hashed
             done();
          }).catch((e) => done(e));
       });
    });

    it('should return return errors if request invalid', (done) => {
      var email = 'xxx';
      var password = 'password1';
      request(app)
      .post('/users')
      .send({email, password})
      .expect(400)
      .end(done);
   });

   it('should not create user if email in use', (done) => {
      var email = 'rob@coolbreeze.co.uk';
      var password = 'password1';
      request(app)
      .post('/users')
      .send({email, password})
      .expect(400)
      .end(done);
   });
});

describe('POST /users/login', () => {
   it('should login user and return auth token', (done) => {
      request(app)
      .post('/users/login')
      .send({
         email: users[1].email,
         password: users[1].password
      })
      .expect((res) => {
         expect(res.headers['x-auth']).toBeTruthy();
      })
      .end((err, res) => {
         if (err) {
            return done(err);
         }
         User.findById(users[1]._id).then((user) => {
            // expect(user.tokens[1]).toInclude({
            //    access: 'auth',
            //    token: res.headers['x-auth']
            // })
// This replaces the above for expect v20 onwards
            expect(user.toObject().tokens[1]).toMatchObject({
               access: 'auth',
               token: res.headers['x-auth']
            })
            done();
         }).catch((e) => done(e));
      })
   });

   it('should reject invalid login', (done) => {
      request(app)
      .post('/users/login')
      .send({
         email: users[1].email,
         password: users[1].password + '1'
      })
      .expect((res) => {
         expect(res.headers['x-auth']).toBeFalsy();
      })
      .end((err, res) => {
         if (err) {
            return done(err);
         }
         User.findById(users[1]._id).then((user) => {
            expect(user.tokens.length).toBe(1);
            done();
         }).catch((e) => done(e));
      })
   });
});

describe('DELETE /users/me/token', () => {
   it('should remove auth token on logout', (done) => {
      request(app)
      .delete('/users/me/token')
      .set('x-auth', users[0].tokens[0].token)// ie send header
      .expect(200)
      .end((err, res) => {
         if (err) {
           return done(err);
         }
         User.findById(users[0]._id).then((user) => {
            expect(user.tokens.length).toBe(0);
            done();
         }).catch((e) => done(e));
      });
   });
});
