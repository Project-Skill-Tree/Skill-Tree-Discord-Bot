const {MessageEmbed, MessageAttachment} = require("discord.js");
const Swipeable = require("./swipeable");
const {addGlow} = require("./badge");

/**
 * Item Object
 * @param name - Item name (e.g. GUIDE TO SELF IMPROVEMENT)
 * @param link - The link to the item resource
 * @param emoji - the emoiji to display with the item
 * @returns {exports}
 */
class Item extends Swipeable {
  constructor(name, link, emoji=null) {
    super();
    this.name = name;
    this.link = link;
    this.emoji = emoji;
  }

  /**
   * Sends an embedded item in the chat
   * @param client
   * @param channel
   */
  async send(client, channel) {
    const icon = new MessageAttachment(await addGlow("icons/chest.png", 50), "icon.png");
    const embed = this.update(new MessageEmbed());
    channel.send({embeds: [embed], files: [icon]});
  }

  /**
   * Updates properties of embed with values from this class
   * @param embed
   */
  update(embed) {
    let description = `+ [${this.name}](${this.link})`;
    if (this.emoji != null) description += ` (${this.emoji})`;

    embed.setColor("#1071E5");
    embed.setTitle("```[ITEM(S) FOUND]```");
    embed.setThumbnail("attachment://icon.png");
    embed.setDescription(description);
    embed.setTimestamp();
    return embed;
  }
}

module.exports = Item;
