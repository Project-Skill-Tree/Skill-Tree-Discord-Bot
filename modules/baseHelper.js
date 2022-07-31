const {getSettings} = require("./functions");

exports.getBaseLocation = async function(client, baselocation) {
  let guild;
  try {
    guild = await client.guilds.fetch(baselocation);
    const botChannel = getSettings(guild).botChannel.replace(/[<#>]/gi, "");
    const channel = await client.channels.fetch(botChannel);
    if (channel) return channel;
    return null;
  } catch (e) {
    //if that fails check for user
    const user = await client.users.fetch(baselocation);
    if (user) return user;
    return null;
  }
}