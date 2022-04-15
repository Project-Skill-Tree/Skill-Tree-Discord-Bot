const {MessageEmbed, MessageAttachment} = require("discord.js");
const {getBadgeIcon} = require("../objects/badge");
const Swipeable = require("./swipeable");

/**
 * Skill Object
 * @param iconPath - image path for the icon to be displayed, relative to "/icons/" folder
 * @param title - Skill title (READING III)
 * @param goal - The success condition for the skill to be complete
 * @param frequency - The time frequency of which to perform the skill (DAILY/WEEKLY etc)
 * @param timelimit - The time limit for which you need to maintain the skill before acquiring it (x5 WEEK(S))
 * @param xp - The amount of XP granted upon completion of the skill
 */
class Skill extends Swipeable {
  constructor(iconPath, title, level, goal, frequency, timelimit, xp) {
    super();
    this.iconPath = iconPath;
    this.title = title;
    this.level = level;
    this.goal = goal;
    this.frequency = frequency;
    this.timelimit = timelimit;
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
    embed.setFields({name: "GOAL: ", value: "```" + `${this.goal} (${this.frequency})` + "```"},
      {name: "TIME: ", value: "```" + `${this.timelimit}` + "```"},
      {name: "XP: ", value: "```diff\n" + `+ ${this.xp}XP` + "```"});
    embed.setTimestamp();

    const embeds = [embed];
    const files = [badgeFile];
    return [embeds, files];
  }
}

module.exports = Skill;
