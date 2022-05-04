const {profile, auth} = require("../../modules/APIHelper");
const {displayProfile} = require("../../modules/ProfileRenderer");
const XPHandler = require("../../modules/XPHandler");

exports.run = (client, message, args, level) => { // eslint-disable-line no-unused-vars
  //Validate user exists
  auth(message.author.id, message.channel,() => {
    profile(message.author, user => {
      user.level = args[0];
      user.xp = Math.floor(Math.random() * XPHandler.calcXP(user.level));
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
