const Skill = require("../objects/skill");
const {createLargeSwipePanel} = require("../modules/createSwipePanel");
const {startSkill, getSkills} = require("../modules/APIHelper");

/**
 * Test method to send an embedded skill to the chat
 * @param client
 * @param message
 * @param args
 * @param level
 */
exports.run = (client, message, args, level) => { // eslint-disable-line no-unused-vars
  getSkills(skills => {
    skills[0].send(message.channel).then(msg => {
      //Create swipable menu
      createLargeSwipePanel(client, message.author, msg, skills, "START", skill => {
        startSkill(message.author, skill.title, skill.level);
      });
    });
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
