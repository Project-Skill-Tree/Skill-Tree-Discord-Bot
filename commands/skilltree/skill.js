const {createLargeSwipePanel} = require("../../modules/createSwipePanel");
const {startSkill, getAvailableSkills, auth} = require("../../modules/APIHelper");

/**
 * Test method to send an embedded skill to the chat
 * @param client
 * @param message
 * @param args
 * @param level
 */
exports.run = (client, message, args, level) => { // eslint-disable-line no-unused-vars
  //Validate user exists
  auth(message.author.id, message.channel,(userID) => {
    skillCommand(client, message,userID);
  });
};

function skillCommand(client, message,userID) {
  //Get available skills
  getAvailableSkills(userID, skills => {
    if (skills.length === 0) {
      message.channel.send("```You have no available skills. Use ~tasks to see what skills you have started```");
      return;
    }

    skills[0].send(message.channel).then(msg => {
      //Create swipable menu
      createLargeSwipePanel(client, message.author, msg, skills, "START", skill => {
        startSkill(message.member.id, skill.title, skill.level);
      });
    });
  });
}

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "skill",
  category: "Skill Tree",
  description: "Displays all of your available skills and allows you to start them",
  usage: "skill"
};
