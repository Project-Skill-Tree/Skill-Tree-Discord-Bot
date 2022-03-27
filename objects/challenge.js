const {MessageEmbed} = require("discord.js");
const Swipeable = require("./swipeable");

/**
 * Item Object
 * @param name - Item name (e.g. GUIDE TO SELF IMPROVEMENT)
 * @param challenge - The challenge description
 * @param xp - The xp to be awarded on completion
 * @param link - The link to the item resource
 * @returns {exports}
 */
class Challenge extends Swipeable {
  constructor(challenge, xp, link=null) {
    super();
    this.challenge = challenge;
    this.xp = xp;
    this.link = link;
  }
  /**
   * Sends an embedded challenge to the chat
   * @param client
   * @param channel
   */
  send(client, channel) {
    const embed = this.update(new MessageEmbed());

    channel.send({ embeds: [embed]});
  }

  /**
   * Updates properties of embed with values from this class
   * @param embed
   */
  update(embed) {
    var link = "";
    //Add link if one exists
    if (this.link) link = `[[LINK]](${this.link})`;
    embed.setColor("#bd290b");
    embed.setTitle("[CHALLENGE]");
    embed.setDescription(`${this.challenge} ` + link + "\n```diff\n"+`+${this.xp}` +"XP```");
    embed.setTimestamp();
    return embed;
  }
}

module.exports = Challenge;
