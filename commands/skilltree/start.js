const {createLargeSwipePanel} = require("../../modules/menuHelper");
const {startSkill, getAvailableSkills, authUser, skipSkill, revertSkill} = require("../../modules/APIHelper");

/**
 * Sends a swipeable list of all the user's available skills
 */
exports.run = (client, message) => {
  //Validate user exists
  authUser(message.author.id, message.channel,(userID) => {
    //Get available skills
    getAvailableSkills(userID, skills => { // gets available,not started skills
      if (skills.length === 0) {
        message.channel.send("```You have no available skills. Use ~tasks to see what skills you have started```");
        return;
      }
      //Create panel showing skills
      createLargeSwipePanel(client, message.author, message.channel, skills, 
        [{
          name: "START",
          description: "Start a skill and add it to your current skills",
          action: (skill) => {
            startSkill(userID, skill.id);
            return true;
          }
        },{
          name: "SKIP",
          description: "Skip the skill and unlock all its children",
          action: (skill) => {
            skipSkill(userID, skill.id);
            return true;
          }
        },{
          name: "REVERT",
          description: "Revert this skill and start the previous task",
          action: (skill) => {
            revertSkill(userID, skill.id);
            return true;
          }
        }], true);
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
