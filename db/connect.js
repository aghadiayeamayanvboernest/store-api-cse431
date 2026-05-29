const { MongoClient } = require('mongodb');

let db;

const initDb = (callback) => {
  if (db) return callback(null, db);
  MongoClient.connect(process.env.MONGODB_URI)
    .then((client) => {
      db = client.db();
      callback(null, db);
    })
    .catch((err) => callback(err));
};

const getDb = () => {
  if (!db) throw new Error('Database not initialized. Call initDb first.');
  return db;
};

module.exports = { initDb, getDb };
