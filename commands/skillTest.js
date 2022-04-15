const Skill = require("../objects/skill");
const {createSwipePanel} = require("../modules/createSwipePanel");

const skills = [
  new Skill("reading.png","Reading", 4, "READ 30m", "day", 30, 1, 800),
  new Skill("meditation.png","Meditation", 1, "Meditate for 30m", "day", 30, 3 ,2000),
  new Skill("exercise.png","Exercise", 3, "Hit PRs in every exercise", "week", 30, 5, 100)
];

/**
 * Test method to send an embedded skill to the chat
 * @param client
 * @param message
 * @param args
 * @param level
 */
exports.run = (client, message, args, level) => { // eslint-disable-line no-unused-vars
  //TODO: Actually take skills from a database
  skills[0].send(message.channel).then(msg => {
    //Create swipable menu
    createSwipePanel(client, message.author, msg, skills);
  });
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "skill",
  category: "Skill Tree",
  description: "Tests embedded skill messages",
  usage: "skill"
};
