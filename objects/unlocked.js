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
   * Sends an embedded skill in the chat
   * @param channel - channel to send the message in
   */
  async send(channel) {
    //Create embedded messages
    const data = await this.update(new MessageEmbed());

    return channel.send({embeds: data[0], files: data[1]});
  }

  /**
   * Updates properties of embed with values from this class
   * @param embed - embedded message to update
   * @returns data - [embed, files]
   */
  async update(embed) {
    const image = await this.object.getIcon();
    const file = new MessageAttachment(image, "img.png");

    await embed.setColor("#d21cff");
    embed.setTitle(`UNLOCKED: ${this.object.getName()}`);
    embed.setThumbnail("attachment://img.png");
    embed.setDescription(this.object.toString());

    const embeds = [embed];
    const files = [file];
    return [embeds, files];
  }
}


module.exports = Unlocked;
