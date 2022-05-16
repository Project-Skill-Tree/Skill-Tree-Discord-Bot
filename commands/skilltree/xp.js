const { addXP } = require("../../modules/APIHelper");
// add XP to your account 
exports.run = (client, message, args) => { // eslint-disable-line no-unused-vars
  if (Object.keys(args).length === 0  ) {
    message.reply("Please specify the amount of XP you want to add");
    return;
  }

  try {
    addXP(args[0],message.member.id);
    message.reply(`You have added \`${args[0]}\` XP to your account`);
  }
  catch (err) {
    console.log(err);
    message.reply("Something went wrong.");
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "Bot Admin"
};
  
exports.help = {
  name: "xp",
  category: "Skill Tree",
  description: "Adds XP to your account",
  usage: "xp"
};
  