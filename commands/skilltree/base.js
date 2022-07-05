const {authUser, setUserLocation} = require("../../modules/userAPIHelper");
const {MessageEmbed} = require("discord.js");

/**
 * Sets a user's "base location" where reminders, weekly reports and more are sent
 */
exports.run = (client, message, args, level) => { // eslint-disable-line no-unused-vars
  //Validate user exists
  authUser(message.author.id, message.channel,(userID) => {
    //Get user profile
    let locationID;
    if (message.channel.type === "DM") {
      locationID = message.author.id;
    } else {
      locationID = message.guild.id;
    }
    setUserLocation(userID, locationID, ()=>{
      let channelName;
      if (message.channel.type === "DM") {
        channelName = "your DMs";
      } else {
        channelName = `"${message.guild.name}"`;
      }
      const baseEmbed = new MessageEmbed()
        .setColor("#3bffbe")
        .setTitle("Base Location Set")
        .setDescription(`Your base location has been set to ${channelName}`);
      message.channel.send({embeds: [baseEmbed]});
    });
  });
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "base",
  category: "Skill Tree",
  description: "Sets your `base` where weekly-reports are published. Use it in the server/DM where you'd like to set your base",
  usage: "base"
};
