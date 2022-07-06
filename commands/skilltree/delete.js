const Discord = require("discord.js");
const { MessageActionRow, MessageButton } = require("discord.js");
const { authUser, deleteUser } = require("../../modules/userAPIHelper");

/**
 * PERMANENTLY DELETES USER INFORMATION FROM DB, added to comply with Discord's Guidelines to protect user privacy
 */
exports.run = (client, message, args, level) => { // eslint-disable-line no-unused-vars
  const embed = new Discord.MessageEmbed()
    .setColor("#ff0000")
    .setTitle("Are You Sure?")
    .setDescription("This action is **permanent!** \n\n Data related to your account would be completely wiped from the database.You would have to complete the setup process again in order to continue using Skill Tree.");
  const row = new MessageActionRow()
    .addComponents(
      new MessageButton()
        .setCustomId("delete_button")
        .setLabel("Proceed")
        .setStyle("DANGER"),
    );

  message.reply({ephemeral: true,embeds: [embed], components: [row]});
  const filter = i => i.customId === "delete_button" && i.user.id === message.author.id;
  const collector = message.channel.createMessageComponentCollector({ filter, time: 15000 });
  collector.on("collect", async i => {
    if (i.customId === "delete_button" && i.user.id === message.author.id) {
      await i.message.delete();
      authUser(message.author.id, message.channel,(userID) => {
        deleteUser(userID);
      });
      message.reply("Account successfully deleted.");
    }
});





};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "delete",
  category: "Skill Tree",
  description: "(PERMANANT) Deletes all data associated with your account from the database. You'd need to do ~setup again if you want to make a new account",
  usage: "delete"
};
