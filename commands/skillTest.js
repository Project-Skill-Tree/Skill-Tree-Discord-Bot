const skill = require("../objects/skill");

/**
 * Test method to send an embedded skill to the chat
 * @param client
 * @param message
 * @param args
 * @param level
 */
exports.run = (client, message, args, level) => { // eslint-disable-line no-unused-vars
  //TODO: Actually take skills from a database
  const R3 = skill("READING III", "READ 30m", "DAILY", "x1 MONTH", 800);
  R3.embedSkill(client, message.channel);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "skill",
  category: "Miscellaneous",
  description: "Tests embedded skill messages",
  usage: "stats"
};
