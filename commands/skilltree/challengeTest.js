const Challenge = require("../../objects/challenge");

/**
 * Test method to send an embedded skill to the chat
 * @param client
 * @param message
 * @param args
 * @param level
 */
exports.run = (client, message, args, level) => { // eslint-disable-line no-unused-vars
  //TODO: Actually take skills from a database
  const challenge = new Challenge("31 days of mindfulness", 2000, "https://cdn.discordapp.com/attachments/842846102696886282/860054078255923200/31_days_of_mindfulness.pdf");
  challenge.send(client, message.channel);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "challenge",
  category: "Skill Tree",
  description: "Tests an embedded challenge message",
  usage: "challenge"
};
