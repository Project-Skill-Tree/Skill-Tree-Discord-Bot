const {MessageEmbed, MessageAttachment} = require("discord.js");
const Swipeable = require("./swipeable");
/**
 * Unlocked objects
 * @implements Swipeable - Can be cycled to display multiple skills
 */
class Unlocked extends Swipeable {
  /**
   * @param object
   * @constructor
   */
  constructor(object) {
    super();
    this.object = object;
  }

  /**
   * Updates properties of embed with values from this class
   * @returns data - [embed, files]
   */
  async update() {
    const image = await this.object.getIcon();
    const file = new MessageAttachment(image, "img.png");

    const embed = new MessageEmbed();
    await embed.setColor("#ffce00");
    embed.setTitle(`UNLOCKED: ${this.object.getName()}`);
    embed.setThumbnail("attachment://img.png");
    embed.setDescription(this.object.toString());

    const embeds = [embed];
    const files = [file];
    return [embeds, files];
  }
}


module.exports = Unlocked;
