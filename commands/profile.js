const Profile = require("../objects/profile");
const Skill = require("../objects/skill");
const {calcXP} = require("../modules/XPHandler");

const skills = [
  new Skill("reading.png","Reading", 4, "READ 30m", 1, "day", 30, 800),
  new Skill("meditation.png","Meditation", 1, "Meditate for 30m", 3, "day", 30 ,2000),
  new Skill("exercise.png","Exercise", 3, "Hit PRs in every exercise", 5, "week", 30, 100)
];

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  const userlvl = Math.floor(Math.random()*100);
  const profile = new Profile(message.author.username, userlvl, Math.floor(Math.random()*calcXP(userlvl)), skills);
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
