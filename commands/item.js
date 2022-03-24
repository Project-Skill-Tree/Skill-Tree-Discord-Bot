const item = require("../objects/item");

/**
 * Test method to send an embedded item to the chat
 * @param client
 * @param message
 * @param args
 * @param level
 */
exports.run = (client, message, args, level) => { // eslint-disable-line no-unused-vars
  // TODO: Actually take skills from a database
  const R3 = item("SELF IMPROVEMENT GUIDE BOOK", "https://www.youtube.com/watch?v=PYaixyrzDOk");
  R3.embedItem(client, message.channel);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "item",
  category: "Miscellaneous",
  description: "Tests embedded item messages",
  usage: "stats"
};
