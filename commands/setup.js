const { MessageEmbed } = require("discord.js");
// var difficulty_level, enabledDMs;
const Configurations = require("../modules/botConfigurations");

exports.run = async (client,message) => {
  //initial embed
  const initEmbed = new MessageEmbed()
    .setTitle(":white_check_mark: Initializing Setup Process")
    .setDescription("Answer the following questions to set up your Skill Tree account")
    .setColor(`#${Configurations().primary}`);
  //Difficulty embed
  const difficultyEmbed = new MessageEmbed()
    .setTitle(":one: Set Experience Level")
    .setColor(`#${Configurations().primary}`)
    .setDescription("Choose one of the following options to optimize Skill Tree to your preferred difficulty level (you can change your difficulty level later by evoking the `setup` command again)");
  //enable DMs embed
  //help and information embed

  try {
    if (message.channel.type === "DM")  await message.channel.send({embeds: [initEmbed]});
    else {
      await message.member.send({embeds: [initEmbed]});
      const instructions_message = await message.reply(":thumbsup: Message with further instruction has been sent to your DMs!");
      setTimeout(() => instructions_message.delete(),10000);
    }
  }
  catch (error) {
    // messages in the same channel saying your DMs are disabled
    message.channel.send(`<@${message.member.id}> Your DMs are Disabled. Please enable them and try again`);
    message.channel.send("**HOW TO ENABLE DMS** \n\n 1) Right-click server icon \n 2) Click on `Privacy Settings` \n 3) Toggle `Allow direct messages from server members` on \n 4) press `Done`");
  }

};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "setup",
  category: "Skill Tree",
  description: "sets up user account",
  usage: "setup"
};