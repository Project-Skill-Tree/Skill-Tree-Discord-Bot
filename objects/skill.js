const {MessageEmbed, MessageAttachment} = require("discord.js");
const Swipeable = require("./swipeable");
const {getBadgeIcon} = require("./badge");
const formatFrequency = require("../modules/frequencyFormatter.js");

/**
 * Skill Object used for storing templates for skills in the tree.
 * @implements Swipeable - Can be cycled to display multiple skills
 */
class Skill extends Swipeable {
  /**
   * Skill constructor
   * @constructor
   * @param {string} iconPath - image path for the icon to be displayed, relative to "/icons/" folder
   * @param {string} title - Skill title (READING)
   * @param {number} level - Skill level (3)
   * @param {string} goal - The success condition for the skill to be complete
   * @param {string} interval - The time interval of the skill. If a skill was to be done x times weekly, weekly would be the interval. Valid values would be "day", "week", "month", "year", etc.
   * @param {number} timelimit - The number of days for which you need to maintain the skill before acquiring it
   * @param {number} frequency - The frequency at which the task of the skill must be completed. Say you have to do x thing 3 times a week, 3 would be the frequency, and weekly would be the time interval.
   * @param {number} xp - The amount of XP granted upon completion of the skill
   */
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
    const badgeIcon = await getBadgeIcon(this.iconPath,"advanced.png",  this.level);
    const badgeFile = new MessageAttachment(badgeIcon, "badge.png");

    embed.setColor("#7d005d");
    embed.setTitle(this.title);
    embed.setThumbnail("attachment://badge.png");
    embed.setFields(
      {
        name: "GOAL: ",
        value: codeBlock(`${this.goal} (${formatFrequency(this.frequency, this.interval)})`),
      },
      {
        name: "TIME: ",
        value: codeBlock(`${this.timelimit} days`),
      },
      {
        name: "XP: ",
        value: codeBlock("diff\n" + `+ ${this.xp}XP`),
      }
    );

    embed.setTimestamp();

    const embeds = [embed];
    const files = [badgeFile];
    return [embeds, files];
  }
}

function codeBlock(str) {
  return "```" + str + "```";
}

module.exports = Skill;
