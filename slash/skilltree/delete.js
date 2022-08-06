const Discord = require("discord.js");
const { MessageActionRow, MessageButton } = require("discord.js");
const { authUser, deleteUser } = require("../../modules/userAPIHelper");
const { replies } = require("../../config.js");

/**
 * PERMANENTLY DELETES USER INFORMATION FROM DB, added to comply with Discord's Guidelines to protect user privacy
 */
exports.run = async (client, interaction) => {
  await interaction.deferReply({ephemeral: interaction.settings.hidden});

  //Validate user exists
  const userID = await authUser(interaction.user.id);
  //Error if no account found
  if (!userID)
    return await interaction.editReplyError(replies.noAccountError);

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

    const message = await interaction.editReplyWarn({
      ephemeral: true,
      title: "Are you sure you want to delete your account?",
      description: "This action is **IRREVERSIBLE!**\n\nData related to your account will be completely wiped from the database, and you would have to complete the setup process again in order to continue using Skill Tree.\n\nClick on **Delete** to delete your account, and **Cancel** to cancel this prompt.",
      components: [row]
    });

  const filter = i => i.user.id === interaction.user.id;
  const collector = message.createMessageComponentCollector({filter, time: 15000});
  collector.on("collect", async i => {
    if (i.customId === "delete") {
      await deleteUser(userID);
      await interaction.editReply({
        title: "Your account was successfully deleted!",
        components: []
      });
    }
    if (i.customId === "cancel")
      await interaction.editReply({
        content: "Account deletion cancelled!",
        components: []
      });
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
