const {MessageEmbed} = require("discord.js");
const Configurations = require("../../modules/botConfigurations");

// eslint-disable-next-line no-unused-vars
exports.run = async (client, message, args, _level) => {
  const embed1 = new MessageEmbed()
    .setTitle("Welcome to Skill Tree")
    .setColor(`#${Configurations().primary}`)
    .setDescription("The following messages will help guide you through the workings of the Skill Tree Application. \n\n Skill Tree is a project dedicated to gamifying self-improvement, and thereby making the great value it brings more accessable (via this bot!) \n By completing tasks involving skills you learn in your day-to-day life, You find yourself growing in a fun way. To gamify this process, Skill Tree will emulate the ideas we love in games such as in-game-characters, XP points and levels, Items and leaderboards.")
    ; 
  await message.reply({embeds:[embed1]});
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "guide",
  category: "Skill Tree",
  description: "Guides you through usage of skill-tree.",
  usage: "guide"
};
