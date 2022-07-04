const {createLargeSwipePanel} = require("../../modules/menuHelper");
const {getInProgress, cancel} = require("../../modules/skillAPIHelper");
const {authUser} = require("../../modules/userAPIHelper");

/**
 * Sends a swipeable list of all the user's available skills
 */
exports.run = (client, message) => {
  //Validate user exists
  authUser(message.author.id, message.channel,(userID) => {
    //Get ongoing skills
    getInProgress(userID, skills => { // gets in progress skills
      if (skills.length === 0) {
        message.channel
          .send("```You have no ongoing skills. Use ~start to see which skills are available to you```")
          .then(msg => {
            setTimeout(() => msg.delete(), 10000);
          });
        return;
      }
      //Create panel showing skills
      createLargeSwipePanel(client, message.author, message.channel, skills, 
        [{
          name: "CANCEL",
          description: "Cancel the skill",
          action: (skill) => {
            cancel(userID, skill);
            return true;
          }
        }]);
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
  name: "cancel",
  category: "Skill Tree",
  description: "Allows you to cancel on-going skills",
  usage: "cancel"
};
