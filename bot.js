// Import the discord.js module
const Discord = require("discord.js");

// Create an instance of a Discord client
const client = new Discord.Client();

//Import modules
const { fillDatabase, getQuote, addQuote, connect } = require("./sendQuotes");
const { PREFIX, HELP_TEXT } = require("./variables.js");

//Connecting to DB
connect();

/**
 * The ready event is vital, it means that only _after_ this will your bot start reacting to information
 * received from Discord
 */
client.on("ready", () => {
  console.log("I am ready!");
});

/**
 * Sends a message in the channel using an embed
 */
const say = (channel, message) => {
  channel.send(
    new Discord.RichEmbed()
      .setTitle("Marquesuzaà dit : ")
      .setColor(0xff0000)
      .setDescription(message)
  );
}

// Create an event listener for messages
client.on("message", message => {
  // Nouveau message sur marquesuzaa_la_legende
  if (message.channel.id === "380444002538749964") {
    const data = {
      text: message.content,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    addQuote(data);
  }

  // Ignore messages that do not start with PREFIX
  if (!message.content.startsWith(PREFIX)) return;

  if (message.content === PREFIX + " fill") {
    // const chan = client.channels.find("name", "marquesuzaa_la_legende");

    // chan.fetchMessages().then(messages => {
    //   const data = messages.array().map(text => {
    //     return { text: text.content };
    //   });
    //   fillDatabase(data)
    //     .then(res => {
    //       say(message.channel, res);
    //     })
    //     .catch(err => {
    //       say(message.channel, err);
    //     });
    // });
    say(message.channel, `Commande temporairement désactivée.
    Contactez Paul Laborderie en cas de problème.`);
  } else if (message.content === PREFIX + " help") {
    say(message.channel, HELP_TEXT);
  } else if (message.content === PREFIX) {
    getQuote()
      .then(quote => {
        say(message.channel, quote);
      })
      .catch(err => {
        say(message.channel, err);
      });
  }
});

client.login(process.env.BOT_TOKEN);
