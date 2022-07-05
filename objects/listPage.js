const Swipeable = require("./swipeable");
const {MessageEmbed} = require("discord.js");

/**
 * ListPage object to display a list of items all at once
 * @implements Swipeable - Can be cycled to display multiple pages
 */
class ListPage extends Swipeable {
  /**
   * Page constructor
   * @constructor
   * @param {string} title - short page title
   * @param {Object[]} list - page content
   * @constructor
   */
  constructor(title, list) {
    super();
    this.title = title;
    this.list = list;
  }

  /**
   * Sends an embedded page in the chat
   * @param message - channel to send the message in
   */
  async send(message) {
    const data = await this.update(new MessageEmbed());

    return message.reply({embeds: data[0]});
  }

  /**
   * Updates properties of embed with values from this class
   * @param embed - embedded message to update
   * @returns data - [embed, files]
   */
  async update(embed) {
    await embed.setColor("#1071E5");
    embed.setTitle(this.title);
    embed.setDescription(this.list.map(v => v.toString()).join("\n"));

    const embeds = [embed];
    return [embeds, null];
  }
}

module.exports = ListPage;
