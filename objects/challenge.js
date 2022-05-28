const {MessageEmbed, MessageAttachment} = require("discord.js");
const Swipeable = require("./swipeable");
const {imageToBuffer} = require("../modules/UIHelper");

/**
 * Challenge Object
 * @param challenge - The challenge description
 * @param {number} xp - The xp to be awarded on completion
 * @param {?string=} link - The link to the item resource
 * @returns {exports}
 */
class Challenge extends Swipeable {
  constructor(challenge, xp, link=null) {
    super();
    this.challenge = challenge;
    this.xp = xp;
    this.link = link;
  }
  /**
   * Sends an embedded challenge to the chat
   * @param client
   * @param channel
   */
  async send(client, channel) {
    //TODO: Dynamically load characters for challenges
    const icon = new MessageAttachment(await imageToBuffer("icons/challenge.png", 100), "icon.png");
    const embed = this.update(new MessageEmbed());

    channel.send({ embeds: [embed], files: [icon]});
  }

  /**
   * Updates properties of embed with values from this class
   * @param embed
   * @return embed
   */
  update(embed) {
    var link = "";
    //Add link if one exists
    if (this.link) link = `[[LINK]](${this.link})`;
    embed.setColor("#bd290b");
    embed.setTitle("[CHALLENGE]");
    embed.setThumbnail("attachment://icon.png");
    embed.setDescription(`${this.challenge} ` + link + "\n```diff\n"+`+${this.xp}` +"XP```");
    embed.setTimestamp();
    return embed;
  }
}

module.exports = Challenge;
