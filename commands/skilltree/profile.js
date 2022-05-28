const {profile, auth} = require("../../modules/APIHelper");
const {displayProfile} = require("../../modules/ProfileRenderer");
const Skill = require("../../objects/skill");

exports.run = (client, message, args, level) => { // eslint-disable-line no-unused-vars
  //Validate user exists
  auth(message.author.id, message.channel,(userID) => {
    profile(userID, user => {
      user.name = message.author.username;
      user.skills = [
        new Skill(0, "MEDITATION", 6, "a", 3, "day", 5, 200, "meditation.png", []),
        new Skill(0, "VIDEO-GAMES", 5, "a", 3, "day", 5, 500, "video-games.png", []),
        new Skill(0, "EXERCISE", 4, "a", 3, "day", 5, 50, "exercise.png", [])
      ];
      user.level = 24;
      user.xp = 530;
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
