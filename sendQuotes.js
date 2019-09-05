const MongoClient = require("mongodb").MongoClient;
const url = process.env.MLAB_URI || 'mongodb://localhost:27017/marquotes';
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
  dbo.collection("quotes").insertOne(data, (err, res) => {
    if (err) throw err;
    console.log("Quote inserted!");
  });
};

const fillDatabase = data => {
  //Insert quotes
  const insertQuotes = quotes => {
    dbo.collection("quotes").insertMany(quotes, (err, res) => {
      if (err) throw err;
      console.log(`Inserted ${res.insertedCount} quotes!`);
    });
  };
  return new Promise((resolve, reject) => {
    console.log(`Data: ${data}`);
    console.log(`Data length: ${data.length}`);
    if (data.length > 0) {
      dbo.listCollections({ name: "quotes" }).next((err, collInfo) => {
        if (err) throw err;
        if (collInfo) {
          //Collection exists; Delete it
          dbo.collection("quotes").drop((err, delOK) => {
            if (err) throw err;
            if (delOK) {
              console.log("Deleted quotes successfully!");
              insertQuotes(data);
            }
          });
        } else {
          //Doesn't exist; Create it
          insertQuotes(data);
        }
      });
      resolve("La liste de citations a été mise à jour avec succès !");
    } else {
      reject(
        new Error(
          "/! Le serveur #marquesuzaa_la_legende est vide, n'existe pas, où je n'ai pas les droits de lecture dessus. /!\\"
        )
      );
    }
  });
};

const getQuote = () => {
  return new Promise((resolve, reject) => {
    dbo
      .collection("quotes")
      .find({})
      .toArray(async (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
          //There are quotes
          const rand = Math.floor(Math.random() * result.length);
          const quote = result[rand].text;
          resolve(quote);
        } else {
          //No quotes loaded!
          reject(
            new Error(
              "/!\\ Aucune citation n'a pu être obtenue. La base de donnée est vide (utilisez la commande fill pour la remplir) ou innacessible (contactez un modérateur où @ExTermeur, créateur du bot)."
            )
          );
        }
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
