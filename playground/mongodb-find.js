const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
   if (err) {
      return console.log('Unable to connext to MongoDB server');
   }
   console.log('Connected to MongoDB server');
   // db.collection('Todos').find({completed: false}).toArray().then((docs) => {
   //    console.log('Todos:');
   //    console.log(JSON.stringify(docs, undefined, 2));
   // }, (err) => {
   //    console.log('Unable to fetch Todos', err);
   // });
   // db.collection('Todos').find({
   //    _id: new ObjectID('5a93f9a92b0fed192cc2f736')}).toArray().then((docs) => {
   //    console.log('Todos:');
   //    console.log(JSON.stringify(docs, undefined, 2));
   // }, (err) => {
   //    console.log('Unable to fetch Todos', err);
   // });
   db.collection('Users').find({name: 'Rob'}).toArray().then((docs) => {
      console.log('Todos:');
      console.log(JSON.stringify(docs, undefined, 2));
   }, (err) => {
      console.log('Unable to fetch Users', err);
   });
   // db.collection('Todos').find().count().then((count) => {
   //    console.log(`Todos count: ${count}`);
   // }, (err) => {
   //    console.log('Unable to fetch Todos', err);
   // });
//   db.close();
});
