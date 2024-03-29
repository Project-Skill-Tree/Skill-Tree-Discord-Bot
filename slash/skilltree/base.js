const {authUser, setUserLocation} = require("../../modules/userAPIHelper");
const {MessageEmbed} = require("discord.js");

/**
 * Sets a user's "base location" where reminders, weekly reports and more are sent
 */
exports.run = async (client, interaction) => {
  await interaction.deferReply({ephemeral: interaction.settings.hidden});

  //Validate user exists
  const userID = await authUser(interaction.user.id);
  //Error if no account found
  if (!userID) {
    await interaction.editReply("```Error: Please create an account with /setup```");
    return;
  }
  //Get user location
  let locationID;
  let channelName;

  if (interaction.channel.type === "DM") {
    channelName = "your DMs";
    locationID = interaction.user.id;
  } else {
    channelName = `"${interaction.guild.name}"`;
    locationID = interaction.guild.id;
  }
  //Attempt base update
  const success = await setUserLocation(userID, locationID);
  if (!success) {
    const cancelledEmbed = new MessageEmbed()
      .setColor("#3bffbe")
      .setTitle("BASE")
      .setDescription("Error: Base failed to update");
    await interaction.editReply({embeds: [cancelledEmbed]});
    return;
  }

  //Show success message
  const baseEmbed = new MessageEmbed()
    .setColor("#3bffbe")
    .setTitle("Base Location Set")
    .setDescription(`Your base location has been set to ${channelName}`);
  await interaction.editReply({embeds: [baseEmbed]});
};

exports.commandData = {
  name: "base",
  description: "Sets your base to where you run the command. Where weekly reports and notifications are sent",
  options: [],
  defaultPermission: true,
  category: "Skill Tree",
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};

