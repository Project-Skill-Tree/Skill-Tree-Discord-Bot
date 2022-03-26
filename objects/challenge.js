const {MessageEmbed} = require("discord.js");

/**
 * Item Object
 * @param name - Item name (e.g. GUIDE TO SELF IMPROVEMENT)
 * @param challenge - The challenge description
 * @param xp - The xp to be awarded on completion
 * @param link - The link to the item resource
 * @returns {exports}
 */
module.exports = function(challenge, xp, link=null) {
  this.challenge = challenge;
  this.xp = xp;
  this.link = link;

  /**
   * Sends an embedded challenge to the chat
   * @param client
   * @param channel
   */
  this.send = function(client, channel) {
    const embed = new MessageEmbed()
      .setColor("#bd290b")
      .setTitle("[CHALLENGE]")
      .setDescription(`${this.challenge}\n` + "```diff\n"+`+${this.xp}` +"XP```")
      .setTimestamp();

    //Add link if one exists
    if (link) embed.setURL(link);

    channel.send({ embeds: [embed]});
  };

  return this;
};
