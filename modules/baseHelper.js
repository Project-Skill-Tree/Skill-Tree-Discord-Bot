const {getSettings} = require("./functions");

exports.getBaseLocation = async function(client, baselocation) {
  //TODO: Potential for sharding to break this?? cache not shared
  const guildID = client.guilds.cache.get(baselocation);
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