const {MessageEmbed, MessageAttachment} = require("discord.js");
const Swipeable = require("./swipeable");
const {getBadgeIcon} = require("./badge");
const {formatFrequency} = require("../modules/dateHelper.js");
const {codeBlock} = require("../modules/UIHelper");
const {romanise} = require("../modules/romanNumeralHelper");

/**
 * Skill Object used for storing templates for skills in the tree.
 * @implements Swipeable - Can be cycled to display multiple skills
 */
class Skill extends Swipeable {
  /**
   * Skill constructor
   * @param id
   * @param {string} title - Skill title (READING)
   * @param {number} level - Skill level (3)
   * @param {string} goal - The success condition for the skill to be complete
   * @param {number} frequency - The frequency at which the task of the skill must be completed. Say you have to do x thing 3 times a week, 3 would be the frequency, and weekly would be the time interval.
   * @param {string} interval - The time interval of the skill. If a skill was to be done x times weekly, weekly would be the interval. Valid values would be "day", "week", "month", "year", etc.
   * @param {number} timelimit - The number of days for which you need to maintain the skill before acquiring it
   * @param {number} xp - The amount of XP granted upon completion of the skill
   * @param {string} icon - image path for the icon to be displayed, relative to "/icons/" folder
   * @param requires - required skills
   * @param children - child skills
   * @constructor
   */
  constructor(id, title, level, goal,
    frequency, interval, timelimit, xp,
    icon,requires, children=[]) {
    super();
    this.id = id;
    this.title = title;
    this.level = level;
    this.goal = goal;
    this.interval = interval;
    this.timelimit = timelimit;
    this.frequency = frequency;
    this.xp = xp;
    this.requires = requires;
    this.children = children;
    this.icon = icon;
  }

  /**
   * Create Skill object from json data
   * @param data - JSON data for the skill
   * @return {Skill}
   */
  static create(data) {
    return new Skill(data._id,
      data.title,
      data.level,
      data.goal,
      data.frequency,
      data.interval,
      data.timelimit,
      data.xp,
      data.icon,
      data.requires,
      data.children);
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
    const badgeIcon = await getBadgeIcon(this.icon, this.level, 300);
    const badgeFile = new MessageAttachment(badgeIcon, "badge.png");

    await embed.setColor("#d21cff");
    embed.setTitle(this.title);
    embed.setThumbnail("attachment://badge.png");
    embed.setDescription(`**GOAL:** ${this.goal.join("\n")} (${formatFrequency(this.frequency, this.interval)})` +
      `\n**TIME:** ${this.timelimit} days` +
      `\n**XP:** ${this.xp}XP`);

    const embeds = [embed];
    const files = [badgeFile];
    return [embeds, files];
  }
}


module.exports = Skill;
