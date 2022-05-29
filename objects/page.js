const Swipeable = require("./swipeable");
const {MessageAttachment, MessageEmbed} = require("discord.js");
const {imageToBuffer} = require("../modules/UIHelper");

/**
 * Page object to save text and image information for swipeable displays
 * @implements Swipeable - Can be cycled to display multiple pages
 */
class Page extends Swipeable {
  /**
   * Page constructor
   * @constructor
   * @param {string} title - short page title
   * @param {string} text - page content
   * @param {?string=} imagePath - optional image path
   * @constructor
   */
  constructor(title, text, imagePath=null) {
    super();
    this.title = title;
    this.text = text;
    this.imagePath = imagePath;
  }

  /**
   * Sends an embedded page in the chat
   * @param channel - channel to send the message in
   */
  async send(channel) {
    const data = await this.update(new MessageEmbed());

    return channel.send({embeds: data[0], files: data[1]});
  }

  /**
   * Updates properties of embed with values from this class
   * @param embed - embedded message to update
   * @returns data - [embed, files]
   */
  async update(embed) {
    embed.setColor("#d21cff");
    embed.setTitle(this.title);
    embed.setDescription(this.text);

    const files = [];
    if (this.imagePath !== null) {
      const imageIcon = await imageToBuffer(this.imagePath, 64);
      const imageFile = new MessageAttachment(imageIcon, "image.png");
      embed.setThumbnail("attachment://image.png");
      files.push(imageFile);
    }

    const embeds = [embed];
    return [embeds, files];
  }
}

module.exports = Page;
