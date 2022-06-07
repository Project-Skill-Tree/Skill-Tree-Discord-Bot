const {getRecentTasks} = require("../../modules/skillAPIHelper");
const {displayReview} = require("../../modules/weeklyReviewRenderer");
const {getUser, authUser} = require("../../modules/userAPIHelper");

/**
 * #TODO TEST METHOD - DELETE ON RELEASE
 * @param client
 * @param message
 */
exports.run = (client, message) => {
  //Authenticate user
  authUser(message.author.id, message.channel,(userID) => {
    //Get user profile
    getUser(userID, message.author.username,user => {
      //Get last 7 days worth of tasks
      getRecentTasks(userID, 7, (tasks) => {
        //Display weekly analytics
        displayReview(user, message, tasks);
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
  name: "weekly",
  category: "Skill Tree",
  description: "Displays your weekly report",
  usage: "weekly"
};
