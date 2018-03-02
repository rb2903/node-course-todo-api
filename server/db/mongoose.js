var mongoose = require('mongoose');

 //copy the link from "To connect using a driver via the standard MongoDB URI" section
 //insert db user name and password here
 const REMOTE_MONGO = 'mongodb://robball:sMtL_0203#@ds155218.mlab.com:55218/robball-todo';
 const LOCAL_MONGO = 'mongodb://localhost:27017/TodoApp';
 const MONGO_URI = process.env.PORT ? REMOTE_MONGO : LOCAL_MONGO;

 mongoose.Promise = global.Promise;
 mongoose.connect(MONGO_URI).then(() => {
     console.log('Connected to Mongo instance.')
 }, (err) => {
     console.log('Error connecting to Mongo instance: ', err);
 });

 module.export = { mongoose };
