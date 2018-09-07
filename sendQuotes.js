const MongoClient = require("mongodb").MongoClient;
const url = process.env.MLAB_URI;

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

const fillDatabase = data => {
  MongoClient.connect(
    url,
    (err, db) => {
      if (err) throw err;
      const dbo = db.db("marquotes");
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
        db.close();
      });
    }
  );
};

const getQuote = new Promise((resolve, reject) => {
  let quote = "";
  MongoClient.connect(
    url,
    (err, db) => {
      if (err) throw err;
      const dbo = db.db("marquotes");
      dbo
        .collection("quotes")
        .find({})
        .toArray(async (err, result) => {
          if (err) throw err;
          const rand = Math.floor(Math.random() * result.length);
          quote = result[rand].text;
          db.close();
          resolve(quote);
        });
    }
  );
});

module.exports = { testConnection, fillDatabase, getQuote };
