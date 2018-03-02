// const MongoClient = require('mongodb').MongoClient;
// The line below does the same as above, using destructuring - note the curly brackets
// const {MongoClient} = require('mongodb');
// This line pulls 2 properties from mongodb.
const {MongoClient, ObjectID} = require('mongodb');
var obj = new ObjectID();

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
   if (err) {
      return console.log('Unable to connext to MongoDB server');
   }
   console.log('Connected to MongoDB server');
   // db.collection('Todos').insertOne({
   //    text: 'Something to do',
   //    completed: false
   // }, (err, result) => {
   //    if (err) {
   //       return console.log('Unable to insert Todo', err);
   //    }
   //    console.log(JSON.stringify(result.ops, undefined, 2));
   // });
   db.collection('Users').insertOne({
      name: 'Rob',
      age: 59,
      location: 'London'
   }, (err, result) => {
      if (err) {
         return console.log('Unable to insert User', err);
      }
      console.log(JSON.stringify(result.ops, undefined, 2));
      console.log(result.ops[0]._id.getTimestamp());
   });
   db.close();
})
