const {getSettings} = require("./functions");

exports.getBaseLocation = async function(client, baselocation) {
  const guildID = client.guilds.fetch(baselocation);
  //Check for guild first
  if (guildID) {
    const botChannel = getSettings(guildID).botChannel.replace(/[<#>]/gi, "");
    const channel = await client.channels.fetch(botChannel);
    if (channel) return channel;
    return null;
  } else {
    //if that fails check for user
    const user = await client.users.fetch(baselocation);
    if (user) return user;
    return null;
  }
}