const {timezoneFromLocation} = require("../../modules/timezoneHelper");
const {MessageEmbed} = require("discord.js");
const {dateAsTime} = require("../../modules/dateHelper");
const {createYesNoPanel} = require("../../modules/menuHelper");
const {authUser, updateTimezone} = require("../../modules/userAPIHelper");

/**
 * Timezone command, sets the user's local timezone offset
 */
exports.run = (client, message, args, level) => { // eslint-disable-line no-unused-vars
  //Validate user exists
  authUser(message.author.id, message.channel,async (userID) => {
    //Get location info
    const locationInfo = await timezoneFromLocation(args.join(" "));
    exports.locationConfirmation(message, message.channel, locationInfo, (locationInfo)=>{
      updateTimezone(userID, locationInfo.utcOffset, ()=>{
        const confirmationEmbed = new MessageEmbed()
          .setColor("#3bffbe")
          .setTitle("TIMEZONE")
          .setDescription("Timezone updated successfully");
        message.channel.send({embeds: [confirmationEmbed]});
      });
    });
  });
};


exports.locationConfirmation = async function(message, scope, locationInfo, callback) {
  const settings = message.settings;

  //Error message
  if (locationInfo === null) {
    scope
      .send("```Invalid timezone: Please make sure you're using the correct format \n" +
      settings.prefix + exports.help.usage + "```")
      .then(msg => {
        setTimeout(() => msg.delete(), 10000);
      });
    return;
  }
  //Calculate local time
  const utc = new Date().getTime() + (new Date().getTimezoneOffset() * 60000);
  const daylightSavingOffset = locationInfo.dstOffset ? locationInfo.dstOffset : 0;
  const localTime = new Date(utc + (3600000 * (locationInfo.utcOffset + daylightSavingOffset)));
  const timezoneEmbed = new MessageEmbed()
    .setColor("#3bffbe")
    .setTitle("TIMEZONE")
    .setDescription(`Timezone detected: ${locationInfo.location}? \n`+
      `Your local time should be ${dateAsTime(localTime)}. Is this correct?`);
  const msg = await scope.send({embeds: [timezoneEmbed]});
  createYesNoPanel(msg, message.author, ()=>{
    callback(locationInfo);
  }, ()=>{});
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "timezone",
  category: "Skill Tree",
  description: "Sets your timezone for reminders and weekly reports",
  usage: "timezone <timezone>/<location>/<timecode> (e.g EST/london/GMT+5)"
};
