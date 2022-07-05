const {MessageEmbed, MessageAttachment} = require("discord.js");
const Swipeable = require("./swipeable");
const {imageToBuffer} = require("../modules/UIHelper");

/**
 * Item Object
 * @implements Swipeable - Can be cycled to display multiple items
 */
class Item extends Swipeable {
  /**
   * Create Item object
   * @param id - mongoDB objectID
   * @param {string} name - Item name (e.g. GUIDE TO SELF IMPROVEMENT)
   * @param {string} link - The link to the item resource
   * @param {?string=} emoji - the emoiji to display with the item
   * @constructor
   */
  constructor(id, name, link, emoji=null) {
    super();
    this.id = id;
    this.name = name;
    this.link = link;
    this.emoji = emoji;
  }

  /**
   * Create Item object from json data
   * @param data - JSON data for the item
   * @return {Item}
   */
  static create(data) {
    return new Item(data._id,
      data.name,
      data.link,
      data.emoji);
  }

  /**
   * Sends an embedded item in the chat
   * @param message
   */
  async send(message) {
    const data = await this.update(new MessageEmbed());

    return message.reply({embeds: data[0], files: data[1]});
  }

  /**
   * Updates properties of embed with values from this class
   * @param embed - embed to update
   * @return embed - updated embed
   */
  async update(embed) {
    const icon = new MessageAttachment(await this.getIcon(), "icon.png");

    await embed.setColor("#1071E5");
    embed.setTitle("```[ITEM FOUND]```");
    embed.setThumbnail("attachment://icon.png");
    embed.setDescription(this.toString());
    return [[embed], [icon]];
  }

  /**
   * Convert item to a string
   * @return {string}
   */
  toString() {
    let description = `+ [${this.name}](${this.link})`;
    if (this.emoji != null) description += ` (${this.emoji})`;
    return description;
  }

  getName() {
    return this.name;
  }

  async getIcon() {
    return imageToBuffer("icons/chest.png", 200);
  }
}

module.exports = Item;
