const Profile = require("../objects/profile");
const Skill = require("../objects/skill");

const skills = [ 
  new Skill("reading.png","Reading", 4, "READ 30m", "day", 30, 1, 800),
  new Skill("meditation.png","Meditation", 1, "Meditate for 30m", "day", 30, 3 ,2000),
  new Skill("exercise.png","Exercise", 3, "Hit PRs in every exercise", "week", 30, 5, 100)
];

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  const profile = new Profile(message.author.username, args[0], 350, skills);
  await profile.send(message.channel);
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
