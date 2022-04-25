
const { MessageEmbed } = require("discord.js");
const logger = require("../modules/logger.js");
const settings = require("../modules/settings.js");
const configurations = require("../modules/botConfigurations.js");


module.exports = (client,member) => {
  logger.log(`[MEMBER JOIN] ${member} joined the guild ${member.guild.id}`);
  const embed = new MessageEmbed()
    .setTitle("Welcome to Skill Tree")
    .setColor(`#${configurations().primary}`)
    .setDescription(`This project aims to gamify self improvement, using a simple modifiable Habit Tracker.\n
    Level up in real life by completing tasks in "trees" created by the community. think of it like an in-game focus tree where you earn XP by doing missions.\n\n
    **How do i use the bot?**\n
    You can set up your skill tree account using the \`${settings.prefix}setup\` command, which can also be used in the Skill Tree app (not released yet!)\n
    look through the \`${settings.prefix}help\` menu to learn more about my features.\n\n
    **resources**\n
    Invite a friend using the invite link: ${configurations().invite_link} \n
    Website: ${configurations().website}`)
    .setThumbnail(client.user.avatarURL)
    // linked image is the skill tree complete PDF iamge
    .setImage("https://media.discordapp.net/attachments/953955545012920370/953968687751245824/SELF_IMPROVEMENT_TECH_TREE.png?width=1499&height=857");
  //checks if the joined server is the official Skill Tree server
  if (String(member.guild.id) === configurations().server_id) member.send({embeds: [embed]});
};

