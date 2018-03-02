const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
   if (err) {
      return console.log('Unable to connext to MongoDB server');
   }
   console.log('Connected to MongoDB server');
   // db.collection('Todos').deleteMany({text: 'another one'}).then((res) => {
   //    console.log(res);
   // })
   // db.collection('Todos').deleteOne({text: 'another one'}).then((res) => {
   //    console.log(res);
   // })
   db.collection('Todos').findOneAndDelete({text: 'another one'}).then((res) => {
      console.log(res);
   })
//   db.close();
});
