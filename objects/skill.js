const {MessageEmbed, MessageAttachment} = require("discord.js");
const Swipeable = require("./swipeable");
const {getBadgeIcon} = require("./badge");
const {formatFrequency} = require("../modules/dateHelper.js");
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
   * @param goals
   * @param {number} frequency - The frequency at which the task of the skill must be completed. Say you have to do x thing 3 times a week, 3 would be the frequency, and weekly would be the time interval.
   * @param {string} interval - The time interval of the skill. If a skill was to be done x times weekly, weekly would be the interval. Valid values would be "day", "week", "month", "year", etc.
   * @param {String} timelimit - The number of days for which you need to maintain the skill before acquiring it
   * @param {number} xp - The amount of XP granted upon completion of the skill
   * @param requires - required skills
   * @param children - child skills
   * @constructor
   */
  constructor(id, title, level, goal, goals,
    frequency, interval, timelimit, xp,requires, children=[]) {
    super();
    this.id = id;
    this.title = title;
    this.level = level;
    this.goal = goal;
    this.goals = goals;
    this.interval = interval;
    this.timelimit = timelimit;
    this.frequency = frequency;
    this.xp = xp;
    this.requires = requires;
    this.children = children;
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
      data.goals,
      data.frequency,
      data.interval,
      data.timelimit,
      data.xp,
      data.requires,
      data.children);
  }

  /**
   * Updates properties of embed with values from this class
   * @param embed - embedded message to update
   * @returns data - [embed, files]
   */
  async update() {
    const badgeFile = new MessageAttachment(await this.getIcon(), "badge.png");

    const embed = new MessageEmbed();
    await embed.setColor("#d21cff");
    embed.setTitle(this.getName());
    embed.setThumbnail("attachment://badge.png");
    embed.setDescription(this.toString());

    const embeds = [embed];
    const files = [badgeFile];
    return [embeds, files];
  }

  toString() {
    if (this.interval === "N/A") {
      return "**GOAL:** \n`" + `${this.goals.join("\n")}` + "`" +
        "\n**TIME:** `N/A`" +
        "\n**XP:** `" + `${this.xp}XP` + "`";
    }
    return "**GOAL:** \n`" + `${this.goals.join("\n")} (${formatFrequency(this.frequency, this.interval)})` + "`" +
    "\n**TIME:** `" + `${this.timelimit} days` + "`" +
    "\n**XP:** `" + `${this.xp}XP` + "`";
  }

  getName() {
    return `${this.title} ${romanise(this.level)}`;
  }

  toLine() {
    return `${this.title} ${romanise(this.level)}`;
  }

  getIconName() {
    return `${this.title.toLowerCase().replace(" ", "-")}.png`;
  }

  async getIcon() {
    return getBadgeIcon(this.getIconName(), this.level, 300);
  }
}


module.exports = Skill;
