const {timezoneFromLocation} = require("../../modules/timezoneHelper");
const {authUser} = require("../../modules/APIHelper");

/**
 * Profile command, authenticates user and displays their profile
 *
 */
exports.run = (client, message, args, level) => { // eslint-disable-line no-unused-vars
  //Validate user exists
  authUser(message.author.id, message.channel,async (userID) => {
    const locationInfo = await timezoneFromLocation(args.join(" "));
    console.log(locationInfo);
  });
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "timezone",
  category: "Skill Tree",
  description: "Displays your character profile, XP, level, badges and more",
  usage: "timezone <location/timezone>"
};
