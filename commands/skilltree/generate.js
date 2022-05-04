
/**
 * Update the skill tree with new values and add new skills
 * @param client
 * @param message
 * @param args
 * @param level
 */
exports.run = (client, message, args, level) => { // eslint-disable-line no-unused-vars

};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "Bot Owner"
};

exports.help = {
  name: "generate",
  category: "Skill Tree",
  description: "Updates and completely rebuilds the skill tree",
  usage: "generate"
};
