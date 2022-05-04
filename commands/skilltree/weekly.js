const {profile, auth} = require("../../modules/APIHelper");
const {displayReview} = require("../../modules/WeeklyReviewRenderer");

exports.run = (client, message, args, level) => { // eslint-disable-line no-unused-vars
  auth(message.author.id, message.channel,() => {
    profile(message.author, user => {
      displayReview(user, message.channel);
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
