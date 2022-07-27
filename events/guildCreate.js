const logger = require("../modules/logger.js");
const settings = require("../modules/settings");
// This event executes when a new guild (server) is joined.

module.exports = async (client, guild) => {
  logger.log(`[GUILD JOIN] ${guild.id} added the bot. Owner: ${guild.ownerId}`);
  await settings.set(guild.id, 0,0);
};
