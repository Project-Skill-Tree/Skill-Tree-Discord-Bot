const Discord = require("discord.js");
const { MessageActionRow, MessageButton } = require("discord.js");
const { authUser, deleteUser } = require("../../modules/userAPIHelper");

/**
 * PERMANENTLY DELETES USER INFORMATION FROM DB, added to comply with Discord's Guidelines to protect user privacy
 */
exports.run = async (client, interaction) => {
  await interaction.deferReply({ephemeral: interaction.settings.hidden});

  //Validate user exists
  const userID = await authUser(interaction.user.id);
  //Error if no account found
  if (!userID) {
    await interaction.editReply("```Error: There is no SkillTree account " +
      "associated with your discord account```");
    return;
  }

  const embed = new Discord.MessageEmbed()
    .setColor("#ff0000")
    .setTitle("Are You Sure?")
    .setDescription("This action is **PERMANENT!** \n\n" +
      "Data related to your account will be completely wiped from the database. " +
      "You would have to complete the setup process again in order to continue using Skill Tree.");
  const row = new MessageActionRow()
    .addComponents(
      new MessageButton()
        .setCustomId("delete")
        .setLabel("Delete")
        .setStyle("DANGER"),
      new MessageButton()
        .setCustomId("cancel")
        .setLabel("Cancel")
        .setStyle("SECONDARY"),
    );

  const message = await interaction.editReply({ephemeral: true, embeds: [embed], components: [row]});
  const filter = i => i.user.id === interaction.user.id;
  const collector = message.createMessageComponentCollector({filter, time: 15000});
  collector.on("collect", async i => {
    if (i.customId === "delete") {
      await deleteUser(userID);
      await interaction.editReply({content: "Account successfully deleted.", embeds: [], components: []});
    }
    if (i.customId === "cancel") {
      await interaction.editReply({content: "Deletion cancelled.", embeds: [], components: []});
    }
  });
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};

exports.commandData = {
  name: "delete",
  description: "(PERMANENT) Deletes all data associated with your account from the database.",
  options: [],
  defaultPermission: true,
  category: "Skill Tree",
};
