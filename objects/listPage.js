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
   * Updates properties of embed with values from this class
   * @returns data - [embed, files]
   */
  async update() {
    const embed = new MessageEmbed();
    await embed.setColor("#1071E5");
    embed.setTitle(this.title);
    embed.setDescription(this.list.map(v => v.toLine()).join("\n"));

    const embeds = [embed];
    const files = [];
    return [embeds, files];
  }
}

module.exports = ListPage;
