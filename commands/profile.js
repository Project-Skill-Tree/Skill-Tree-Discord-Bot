const {profile} = require("../modules/APIHelper");

exports.run = (client, message, args, level) => { // eslint-disable-line no-unused-vars
  profile(message.author, user => {
    user.send(message.channel);
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
