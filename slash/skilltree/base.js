const {authUser, setUserLocation} = require("../../modules/userAPIHelper");
const {MessageEmbed} = require("discord.js");

/**
 * Sets a user's "base location" where reminders, weekly reports and more are sent
 */
exports.run = async (client, interaction) => {
  await interaction.deferReply({ ephemeral: interaction.settings.hidden });

  //Validate user exists
  const userID = await authUser(interaction.user.id);
  //Error if no account found
  if (!userID)
    return await interaction.editReplyError({
      title: "Oops! You don't have an account yet!",
      description: "Please create an account with `~setup` first, before using this command."
    });

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
  if (!success)
    return await interaction.editReplyError({
      title: "Oops! There was an error!",
      description: "The base failed to update.\nPlease retry this command later."
    });

  //Show success message
  await interaction.editReply({
    title: "Your base location was saved!",
    description: `Your base location has been set to ${channelName}.`
  });
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

