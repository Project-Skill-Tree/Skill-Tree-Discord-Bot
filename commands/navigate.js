const Skill = require("../objects/skill");
const createNavigationPanel = require("../modules/createNavigationPanel");

const root = new Skill("reading.png","READING", 4, "READ 30m", "DAILY", "x1 MONTH", 800);

root.setChildren([new Skill("reading.png","READING", 4, "READ 30m", "DAILY", "x1 MONTH", 800),
  new Skill("meditation.png","MEDITATION", 1, "Meditate for 30m", "DAILY", "x1 MONTH", 2000),
  new Skill("exercise.png","EXERCISE", 3, "Hit PRs in every exercise", "N/A", "x1 MONTH", 100)]);

/**
 * Test method to send an embedded skill to the chat
 * @param client
 * @param message
 * @param args
 * @param level
 */
exports.run = (client, message, args, level) => { // eslint-disable-line no-unused-vars
  //TODO: Actually take skills from a database
  root.send(message.channel).then(msg => {
    //Create navigation menu
    createNavigationPanel(client, message.author, msg, root);
  });
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "nav",
  category: "Miscellaneous",
  description: "Tests embedded skill messages",
  usage: "skill"
};
