const Skill = require("../objects/skill");
const {createLargeSwipePanel} = require("../modules/createSwipePanel");
const {startSkill, getAvailableSkills, authUser} = require("../modules/APIHelper");

/**
 * Test method to send an embedded skill to the chat
 * @param client
 * @param message
 * @param args
 * @param level
 */
exports.run = (client, message, args, level) => { // eslint-disable-line no-unused-vars
  if (!authUser(message.author.id)) return;

  getAvailableSkills(message.author.id, skills => {
    console.log(skills.length);
    if (skills.length === 0) {
      message.channel.send("```You have no available skills. Use ~tasks to see what```");
      return;
    }

    skills[0].send(message.channel).then(msg => {
      //Create swipable menu
      createLargeSwipePanel(client, message.author, msg, skills, "START", skill => {
        startSkill(message.author.id, skill.title, skill.level);
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
