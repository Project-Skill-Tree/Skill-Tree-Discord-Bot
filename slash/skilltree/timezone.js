const {timezoneFromLocation} = require("../../modules/timezoneHelper");
const {MessageEmbed} = require("discord.js");
const {dateAsTime} = require("../../modules/dateHelper");
const {createYesNoPanel} = require("../../modules/menuHelper");
const {authUser, updateTimezone} = require("../../modules/userAPIHelper");

/**
 * Timezone command, sets the user's local timezone offset
 */
exports.run = async (client, interaction) => {
  await interaction.deferReply({ephemeral: true});

  //Validate user exists
  const userID = await authUser(interaction.user.id);
  //Error if no account found
  if (!userID) {
    await interaction.editReply("```Error: Please create an account with ~setup```");
    return;
  }

  //Get location info
  const timezone = interaction.options.get("timezone").value;
  const locationInfo = await timezoneFromLocation(timezone);

  //Create confirmation
  const confirm = await exports.locationConfirmation(interaction, locationInfo);
  //If not confirmed, return
  if (confirm !== "confirmed") {
    const cancelledEmbed = new MessageEmbed()
      .setColor("#3bffbe")
      .setTitle("TIMEZONE")
      .setDescription(confirm);
    await interaction.editReply({embeds: [cancelledEmbed]});
    return;
  }
  //otherwise update
  await updateTimezone(userID, locationInfo.utcOffset);

  const confirmationEmbed = new MessageEmbed()
    .setColor("#3bffbe")
    .setTitle("TIMEZONE")
    .setDescription("Timezone updated successfully");
  await interaction.editReply({embeds: [confirmationEmbed], components: []});
};


/**
 * Ask user to confirm location
 * Returns cancellation and invalid format error messages
 * @param interaction
 * @param locationInfo
 * @return {Promise<string|boolean|string>}
 */
exports.locationConfirmation = async function(interaction, locationInfo) {

  //Error message
  if (locationInfo === null) {
    return "Timezone update failed: Please make sure you're using the correct format: \n\n" +
      "<timezone> or <location> or <timecode> (e.g EST, london, GMT+5:30)";
  }
  //Calculate local time
  const utc = new Date().getTime() + (new Date().getTimezoneOffset() * 60000);
  const daylightSavingOffset = locationInfo.dstOffset ?? 0;
  const localTime = new Date(utc + (3600000 * (locationInfo.utcOffset + daylightSavingOffset)));
  const timezoneEmbed = new MessageEmbed()
    .setColor("#3bffbe")
    .setTitle("TIMEZONE")
    .setDescription(`Timezone detected: ${locationInfo.location}? \n`+
      `Your local time should be ${dateAsTime(localTime)}. Is this correct?`);
  const confirm = await createYesNoPanel(interaction, timezoneEmbed);
  return confirm ? "confirmed" : "Timezone update cancelled";
};


exports.commandData = {
  name: "timezone",
  description: "Sets your timezone for reminders and weekly reports",
  options: [
    {
      name: "timezone",
      description: "<timezone> or <location> or <timecode> (e.g EST, london, GMT+5:30)",
      type: "STRING",
      required: true,
    }
  ],
  defaultPermission: true,
  category: "Skill Tree",
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};