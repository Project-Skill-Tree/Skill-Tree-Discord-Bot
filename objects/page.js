const Swipeable = require("./swipeable");
const {MessageAttachment, MessageEmbed} = require("discord.js");

/**
 * Page object to save text and image information for swipeable displays
 * @implements Swipeable - Can be cycled to display multiple pages
 */
class Page extends Swipeable {
  /**
   * Page constructor
   * @constructor
   * @param {string} title - short page title
   * @param {?buffer=} image - optional image path
   * @param {string} text - page content
   * @constructor
   */
  constructor(title, image, text) {
    super();
    this.title = title;
    this.image = image;
    this.text = text;
  }

  /**
   * Updates properties of embed with values from this class
   * @returns data - [embed, files]
   */
  async update() {
    const embed = new MessageEmbed();
    embed.setColor("#d21cff");
    embed.setTitle(this.title);
    embed.setDescription(this.text);

    const files = [];
    if (this.image !== null) {
      const imageFile = new MessageAttachment(this.image, "image.png");
      embed.setThumbnail("attachment://image.png");
      files.push(imageFile);
    }

    const embeds = [embed];
    return [embeds, files];
  }
}

module.exports = Page;
