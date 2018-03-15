const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
   if (err) {
      return console.log('Unable to connect to MongoDB server');
   }
   console.log('Connected to MongoDB server');
   db.collection('Users').findOneAndUpdate({
      _id: new ObjectID('5a9409db1e60ea0d84385225')
   }, {
      $set: {
         name: 'Robert'
      },
      $inc: {
         age: 1
      }
   }, {
      returnOriginal: false
   }).then((result) => {
      console.log(result);
   });
//   db.close();
});
