const {timezoneFromLocation} = require("../../modules/timezoneHelper");
const {authUser} = require("../../modules/APIHelper");
const {MessageEmbed} = require("discord.js");
const {dateAsTime} = require("../../modules/dateHelper");
const {createYesNoPanel} = require("../../modules/menuHelper");

/**
 * Profile command, authenticates user and displays their profile
 *
 */
exports.run = (client, message, args, level) => { // eslint-disable-line no-unused-vars
  const settings = message.settings;

  //Validate user exists
  authUser(message.author.id, message.channel,async (userID) => {
    //Get location info
    const locationInfo = await timezoneFromLocation(args.join(" "));
    //Error message
    if (locationInfo === null) {
      message.channel.send("```Invalid timezone: Please make sure you're using the correct format \n" +
        settings.prefix + exports.help.usage + "```");
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
    const msg = await message.channel.send({embeds: [timezoneEmbed]});
    createYesNoPanel(msg, message.author, ()=>{}, ()=>{});
  });
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
