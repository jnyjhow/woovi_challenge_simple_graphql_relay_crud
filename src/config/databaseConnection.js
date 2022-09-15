//require("dotenv").config();
const { MongoClient } = require("mongodb");

let mongoDB;

const setupDB = (callback) => {
  const uri = process.env.MONGOBD_URI;

  MongoClient.connect(
    uri,
    { useNewUrlParser: true, useUnifiedTopology: true },
    (err, client) => {
      mongoDB = client.db(process.env.MONGOBD_DATABASE);

      if (err) {
        return callback(err);
      } else {
        return callback("DB: OK");
      }
    }
  );
};

const getDB = () => {
  return mongoDB;
};

module.exports = { setupDB, getDB };
