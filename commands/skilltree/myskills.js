const {createLargeSwipePanel} = require("../../modules/createSwipePanel");
const {startSkill, getAvailableSkills, auth} = require("../../modules/APIHelper");

/**
 * Sends a swipeable list of all the user's available skills
 */
exports.run = (client, message) => {
  //Validate user exists
  auth(message.author.id, message.channel,(userID) => {
    //Get available skills
    getAvailableSkills(userID, skills => { // gets available,not started skills
      if (skills.length === 0) {
        message.channel.send("```You have no available skills. Use ~tasks to see what skills you have started```");
        return;
      }
      //Create panel showing skills
      createLargeSwipePanel(client, message.author, message.channel, skills, "START", (skill) => {
        startSkill(userID, skill.id);
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
  name: "start",
  category: "Skill Tree",
  description: "Displays all of your available skills and allows you to start them",
  usage: "start"
};
