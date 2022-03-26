const {MessageEmbed} = require("discord.js");

/**
 * Item Object
 * @param name - Item name (e.g. GUIDE TO SELF IMPROVEMENT)
 * @param link - The link to the item resource
 * @returns {exports}
 */
module.exports = function(name, link) {
  this.name = name;
  this.link = link;

  /**
   * Sends an embedded item in the chat
   * @param client
   * @param channel
   */
  this.send = function(client, channel) {
    const embed = new MessageEmbed()
      .setColor("#1071E5")
      .setTitle("```[ITEM FOUND]```")
      .setDescription(`++[${this.name}](${this.link})`)
      .setTimestamp();
    channel.send({ embeds: [embed]});
  };

  return this;
};
