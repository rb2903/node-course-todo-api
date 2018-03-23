var env = process.env.NODE_ENV || 'development';

if (env === 'development' || env === 'test') {
// When requiring a json file it automatically parses it into a javascript object.
   var config = require('./config.json');
   var envConfig = config[env];// ie accessing the "test" or "development" property of the config object - need to use bracket notation.
   Object.keys(envConfig).forEach((key) => {
      process.env[key] = envConfig[key];
   })
}

// if (env === 'development') {
//   process.env.PORT = 3000;
//   process.env.MONGO_URI = 'mongodb://localhost:27017/TodoApp';
// } else if (env === 'test') {
//   process.env.PORT = 3000;
//   process.env.MONGO_URI = 'mongodb://localhost:27017/TodoAppTest';
// } else {
//    process.env.MONGO_URI = 'mongodb://robball:sMtL_0203#@ds155218.mlab.com:55218/robball-todo';
// }
