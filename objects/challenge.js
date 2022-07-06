const {MessageEmbed, MessageAttachment} = require("discord.js");
const Swipeable = require("./swipeable");
const {imageToBuffer} = require("../modules/UIHelper");

/**
 * Challenge Object
 * @implements Swipeable - Can be cycled to display multiple challenges
 */
class Challenge extends Swipeable {
  /**
   * @param id - mongoDB objectID
   * @param title - title of the challenge
   * @param goal - The goal description
   * @param goals - List of goal descriptions
   * @param {number} xp - The xp to be awarded on completion
   * @param {?string=} link - The link to the item resource (default: null)
   * @constructor
   */
  constructor(id, title, goal, goals, xp, link=null) {
    super();
    this.id = id;
    this.title = title;
    this.goal = goal;
    this.goals = goals;
    this.xp = xp;
    this.link = link;
  }

  /**
   * Create challenge object from json data
   * @param data - JSON data for the challenge
   * @return {Challenge}
   */
  static create(data) {
    return new Challenge(data._id,
      data.title,
      data.goal,
      data.goals,
      data.xp,
      data.link);
  }

  /**
   * Sends an embedded challenge to the chat
   * @param message
   */
  async send(message) {
    const data = await this.update(new MessageEmbed());

    return await message.reply({ embeds: data[0], files: data[1]});
  }

  /**
   * Updates properties of embed with values from this class
   * @param embed - embed to update
   * @return embed - updated embed
   */
  async update(embed) {
    //Add link if one exists
    const icon = new MessageAttachment(await this.getIcon(), "icon.png");
    await embed.setColor("#bd290b");
    embed.setTitle("```[CHALLENGE]```");
    embed.setThumbnail("attachment://icon.png");
    embed.setDescription(this.toString());
    return [[embed], [icon]];
  }

  getName() {
    return this.title;
  }

  toLine() {
    return this.title;
  }

  toString() {
    let link = "";
    if (this.link) link = `\n**LINK**: [[LINK]](${this.link})`;
    return "**GOAL:** \n`" + `${this.goals.join("\n")}` + "`" + link + "\n```diff\n"+`+${this.xp}` +"XP```";
  }

  async getIcon() {
    return imageToBuffer("icons/challenge.png", 200);
  }
}

module.exports = Challenge;
