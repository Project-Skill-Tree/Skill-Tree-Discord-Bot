const {getUser, authUser, setUserLocation} = require("../../modules/userAPIHelper");
const {displayProfile} = require("../../modules/profileRenderer");

/**
 * Profile command, authenticates user and displays their profile
 *
 */
exports.run = (client, message, args, level) => { // eslint-disable-line no-unused-vars
  //Validate user exists
  authUser(message.author.id, message.channel,(userID) => {
    //Get user profile
    setUserLocation(userID, message.channel.id);
  });
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "base",
  category: "Skill Tree",
  description: "Sets your base location where reminders and weekly-reports are published",
  usage: "base"
};
