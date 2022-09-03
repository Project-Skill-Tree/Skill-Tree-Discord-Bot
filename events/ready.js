const logger = require("../modules/logger.js");

module.exports = async client => {   
  const globalCmds = client.container.slashcmds.filter(c => !c.conf.guildOnly);
  
  await client.application?.commands.set(globalCmds.map(c => c.commandData)).catch(e => console.log(e));
  
  client.user.setActivity("/help & /guide", { type: "PLAYING" });

  logger.log(`${client.user.tag}, ready to serve ${client.guilds.cache.map(g => g.memberCount).reduce((a, b) => a + b)} users in ${client.guilds.cache.size} servers.`, "ready");
};
