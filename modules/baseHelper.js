const {getSettings} = require("./functions");

exports.getBaseLocation = async function(client, userid, baselocation) {
  let guild;
  try {
    guild = await client.guilds.fetch(baselocation);
    const botChannel = getSettings(guild).botChannel.replace(/[<#>]/gi, "");
    try {
      const channel = await client.channels.fetch(botChannel);
      if (channel) return channel;
    } catch (e) {
      return null;
    }
  } catch (e) {
    //if that fails check for user
    try {
      const user = await client.users.fetch(baselocation);
      if (user) return user;
    } catch (e) {
      try {
        const user = await client.users.fetch(userid);
        if (user) return user;
      } catch (e) {
        return null;
      }
    }
  }
};