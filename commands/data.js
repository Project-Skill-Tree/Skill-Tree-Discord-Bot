const API = require("../modules/APIHelper.js");

// eslint-disable-next-line no-unused-vars
exports.run = async (client, message, args, _level) => {
  const skill = await API.getSkills();
  message.channel.send(JSON.stringify(skill.data[0]));
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "data",
  category: "Skill Tree",
  description: "Tests the API",
  usage: "data"
};
