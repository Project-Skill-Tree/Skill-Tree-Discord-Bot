const {MessageEmbed, MessageAttachment} = require("discord.js");
const badge = require("./badge");
const Swipeable = require("./swipeable");

/**
 * Item Object
 * @param name - Item name (e.g. GUIDE TO SELF IMPROVEMENT)
 * @param link - The link to the item resource
 * @returns {exports}
 */
class Item extends Swipeable {
  constructor(name, link) {
    super();
    this.name = name;
    this.link = link;
  }

  /**
   * Sends an embedded item in the chat
   * @param client
   * @param channel
   */
  async send(client, channel) {
    const badgeIcon = await badge("chest.png", -1, "elite.png");
    const badgeFile = new MessageAttachment(badgeIcon, "icon.png");

    const embed = this.update(new MessageEmbed());
    channel.send({embeds: [embed], files: [badgeFile]});
  }

  /**
   * Updates properties of embed with values from this class
   * @param embed
   */
  update(embed) {
    embed.setColor("#1071E5");
    embed.setTitle("```[ITEM FOUND]```");
    embed.setThumbnail("attachment://icon.png");
    embed.setDescription(`++[${this.name}](${this.link})`);
    embed.setTimestamp();
    return embed;
  }
}


module.exports = Item;
