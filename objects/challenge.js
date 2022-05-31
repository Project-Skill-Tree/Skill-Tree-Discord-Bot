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
   * @param challenge - The challenge description
   * @param {number} xp - The xp to be awarded on completion
   * @param {?string=} link - The link to the item resource (default: null)
   * @constructor
   */
  constructor(id, challenge, xp, link=null) {
    super();
    this.id = id;
    this.challenge = challenge;
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
      data.challenge,
      data.xp,
      data.link);
  }

  /**
   * Sends an embedded challenge to the chat
   * @param channel
   */
  async send(channel) {
    const data = await this.update(new MessageEmbed());

    return channel.send({ embeds: data[0], files: data[1]});
  }

  /**
   * Updates properties of embed with values from this class
   * @param embed - embed to update
   * @return embed - updated embed
   */
  async update(embed) {
    let link = "";
    //Add link if one exists
    const icon = new MessageAttachment(await imageToBuffer("icons/challenge.png", 200), "icon.png");
    if (this.link) link = `[[LINK]](${this.link})`;
    await embed.setColor("#bd290b");
    embed.setTitle("[CHALLENGE]");
    embed.setThumbnail("attachment://icon.png");
    embed.setDescription(`${this.challenge} ` + link + "\n```diff\n"+`+${this.xp}` +"XP```");
    return [[embed], [icon]];
  }
}

module.exports = Challenge;
