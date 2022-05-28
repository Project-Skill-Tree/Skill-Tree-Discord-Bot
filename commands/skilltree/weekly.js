const {profile, auth, getRecentTasks} = require("../../modules/APIHelper");
const {displayReview} = require("../../modules/weeklyReviewRenderer");

exports.run = (client, message, args, level) => { // eslint-disable-line no-unused-vars
  auth(message.author.id, message.channel,(userID) => {
    profile(userID, user => {
      getRecentTasks(userID, 7, (tasks) => {
        displayReview(user, message.channel, tasks);
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
