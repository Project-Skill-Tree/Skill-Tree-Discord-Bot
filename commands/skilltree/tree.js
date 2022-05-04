const {displayTree} = require("../../modules/TreeRenderer");

exports.run = (client, message, args, level) => { // eslint-disable-line no-unused-vars
  displayTree(message.channel);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "tree",
  category: "Skill Tree",
  description: "Displays the skill tree",
  usage: "tree"
};
