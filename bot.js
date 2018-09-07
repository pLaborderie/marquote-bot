// Import the discord.js module
const Discord = require("discord.js");

// Create an instance of a Discord client
const client = new Discord.Client();

//Import modules
const { fillDatabase, getQuote, addQuote, connect } = require("./sendQuotes");

//Connecting to DB
connect();

/**
 * The ready event is vital, it means that only _after_ this will your bot start reacting to information
 * received from Discord
 */
client.on("ready", () => {
  console.log("I am ready!");
});

// Create an event listener for messages
client.on("message", message => {
  //Nouveau message sur marquesuzaa_la_legende
  if (message.channel.name === "marquesuzaa_la_legende") {
    const data = { text: message.content };
    addQuote(data);
  }

  if (message.content === "fill") {
    const chan = client.channels.find("name", "marquesuzaa_la_legende");

    chan.fetchMessages().then(messages => {
      const data = messages.array().map(text => {
        return { text: text.content };
      });
      fillDatabase(data);
      //Envoi message
      message.channel.send(
        new Discord.RichEmbed()
          .setTitle("Marquesuzaà dit : ")
          .setColor(0xff0000)
          .setDescription(
            "La liste de citations a été mise à jour avec succès !"
          )
      );
    });
  } else if (message.content === "marquote") {
    getQuote().then(quote => {
      console.log(quote);
      message.channel.send(
        new Discord.RichEmbed()
          .setTitle("Marquesuzaà dit : ")
          .setColor(0xff0000)
          .setDescription(quote)
      );
    });
  }
});

// Log our bot in using the token from https://discordapp.com/developers/applications/me
client.login(process.env.BOT_TOKEN);
