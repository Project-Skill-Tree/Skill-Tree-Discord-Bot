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
   * @param message - channel to send the message in
   * @param channel
   */
  async send(message, channel) {
    //Create embedded messages
    const data = await this.update(new MessageEmbed());

    if (message !== null) {
      return await message.reply({embeds: data[0], files: data[1]});
    } else {
      return await channel.send({embeds: data[0], files: data[1]});
    }
  }

  /**
   * Updates properties of embed with values from this class
   * @param embed - embedded message to update
   * @returns data - [embed, files]
   */
  async update(embed) {
    const image = await this.object.getIcon();
    const file = new MessageAttachment(image, "img.png");

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
