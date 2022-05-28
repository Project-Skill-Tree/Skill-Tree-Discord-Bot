const {profile, auth} = require("../../modules/APIHelper");
const {displayProfile} = require("../../modules/ProfileRenderer");

/**
 * Profile command, authenticates user and displays their profile
 *
 */
exports.run = (client, message, args, level) => { // eslint-disable-line no-unused-vars
  //Validate user exists
  auth(message.author.id, message.channel,(userID) => {
    //Get user profile
    profile(userID, message.author.username, user => {
      //Display profile
      displayProfile(user, message.channel);
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
  name: "profile",
  category: "Skill Tree",
  description: "Displays your character profile, XP, level, badges and more",
  usage: "profile"
};
