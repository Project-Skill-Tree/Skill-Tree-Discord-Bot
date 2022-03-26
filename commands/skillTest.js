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
  const R3 = new skill("reading.png","READING", 4, "READ 30m", "DAILY", "x1 MONTH", 800);
  R3.sendSkill(client, message.channel);

  /*const A1 = new skill("meditation.png","MEDITATION", 6, "MEDITATE 30m", "N/A", "x1 WEEK", 200);
  A1.sendSkill(client, message.channel);

  const A2 = new skill("exercise.png","EXERCISE", 1, "Exercise 30m", "DAILY", "x1 MONTH", 800);
  A2.sendSkill(client, message.channel);

  const A3 = new skill("brain.png","READING", 3, "Discipline 100m", "DAILY", "x1 YEAR", 1500);
  A3.sendSkill(client, message.channel);*/
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
