const { MongoClient } = require('mongodb');

let dbConnection;
const url =
  'mongodb+srv://squawk7x:Falcon7x@cluster0.2llkx6k.mongodb.net/?retryWrites=true&w=majority';
// const url = 'mongodb://localhost:27017/bridge'

module.exports = {
  connectToDb: (cb) => {
    MongoClient.connect(url)
      .then((client) => {
        dbConnection = client.db();
        cb();
      })
      .catch((err) => {
        console.log(err);
        cb(err);
      });
  },
  getDb: () => dbConnection,
};
