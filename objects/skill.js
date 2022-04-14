const {MessageEmbed, MessageAttachment} = require("discord.js");
const {getBadgeIcon} = require("../objects/badge");
const Swipeable = require("./swipeable");

/**
 * Skill Object
 * @param {string} iconPath - image path for the icon to be displayed, relative to "/icons/" folder
 * @param {string} title - Skill title (READING III)
 * @param {string} goal - The success condition for the skill to be complete
 * @param {string} interval - The time interval of the skill. If a skill was to be done x times weekly, weekly would be the interval. Valid values would be "day", "week", "month", "year", etc.
 * @param {number} timelimit - The number of days for which you need to maintain the skill before acquiring it
 * @param {number} xp - The amount of XP granted upon completion of the skill
 */
class Skill extends Swipeable {
  constructor(iconPath, title, level, goal, interval, timelimit, frequency, xp) {
    super();
    this.iconPath = iconPath;
    this.title = title;
    this.level = level;
    this.goal = goal;
    this.interval = interval;
    this.timelimit = timelimit; 
    this.frequency = frequency;
    this.xp = xp;
  }

  /**
     * Sends an embedded skill in the chat
     * @param channel
     */
  async send(channel) {
    //Create embedded messages
    const data = await this.update(new MessageEmbed());

    return channel.send({embeds: data[0], files: data[1]});
  }

  /**
   * Updates properties of embed with values from this class
   * @param embed
   */
  async update(embed) {
    const badgeIcon = await getBadgeIcon(this.iconPath,"advanced.png",  this.level);
    const badgeFile = new MessageAttachment(badgeIcon, "badge.png");

    await embed.setColor("#7d005d");
    embed.setTitle(this.title);
    embed.setThumbnail("attachment://badge.png");
    embed.setFields({name: "GOAL: ", value: "```" + `${this.goal} (${this.time})` + "```"},
      {name: "TIME: ", value: "```" + `${this.timelimit}` + "```"},
      {name: "XP: ", value: "```diff\n" + `+ ${this.xp}XP` + "```"});
    embed.setTimestamp();

    const embeds = [embed];
    const files = [badgeFile];
    return [embeds, files];
  }
}

module.exports = Skill;
