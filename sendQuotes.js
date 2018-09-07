const MongoClient = require("mongodb").MongoClient;
const url = process.env.MLAB_URI;
let dbo;

const testConnection = () => {
  MongoClient.connect(
    url,
    (err, db) => {
      if (err) throw err;
      console.log("Hey it works!");
      db.close();
    }
  );
};

const connect = () => {
  MongoClient.connect(
    url,
    (err, db) => {
      if (err) throw err;
      dbo = db.db("marquotes");
    }
  );
};

const close = () => {
  db.close();
};

const addQuote = data => {
  const dbo = db.db("marquotes");
  dbo.collection("quotes").insertOne(data, (err, res) => {
    if (err) throw err;
    console.log("Quote inserted!");
  });
};

const fillDatabase = data => {
  dbo.listCollections({ name: "quotes" }).next((err, collInfo) => {
    if (err) throw err;
    if (collInfo) {
      //Collection exists; Delete it
      dbo.collection("quotes").drop((err, delOK) => {
        if (err) throw err;
        if (delOK) {
          console.log("Deleted quotes successfully!");
        }
      });
    }
  });
  //Insert quotes
  dbo.collection("quotes").insertMany(data, (err, res) => {
    if (err) throw err;
    console.log(`Inserted ${res.insertedCount} quotes!`);
  });
};

const getQuote = () => {
  return new Promise((resolve, reject) => {
    let quote = "";
    dbo
      .collection("quotes")
      .find({})
      .toArray(async (err, result) => {
        if (err) throw err;
        const rand = Math.floor(Math.random() * result.length);
        console.log(rand);
        quote = result[rand].text;
        resolve(quote);
      });
  });
};

module.exports = {
  testConnection,
  fillDatabase,
  getQuote,
  addQuote,
  connect,
  close
};
