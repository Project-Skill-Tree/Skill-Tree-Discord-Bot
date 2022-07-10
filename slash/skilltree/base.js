const {authUser, setUserLocation} = require("../../modules/userAPIHelper");
const {MessageEmbed} = require("discord.js");

/**
 * Sets a user's "base location" where reminders, weekly reports and more are sent
 */
exports.run = async (client, interaction) => { // eslint-disable-line no-unused-vars
  await interaction.deferReply({ephemeral: true});

  //Validate user exists
  const userID = await authUser(interaction.user.id);
  //Error if no account found
  if (!userID) {
    await interaction.editReply("```Error: Please create an account with ~setup```");
    return;
  }
  //Get user location
  let locationID;
  if (interaction.channel.type === "DM") {
    locationID = interaction.author.id;
  } else {
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
  let channelName;
  if (interaction.channel.type === "DM") {
    channelName = "your DMs";
  } else {
    channelName = `"${interaction.guild.name}"`;
  }
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
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};