const {MessageEmbed, MessageAttachment} = require("discord.js");
const badge = require("../objects/badge");

/**
 * Skill Object
 * @param title - Skill title (READING III)
 * @param goal - The success condition for the skill to be complete
 * @param time - The time frequency of which to perform the skill
 * @param timelimit - The time limit of which you need to maintain the skill before aquiring it
 * @param xp - The amount of XP granted upon completion of the skill
 * @returns {exports}
 */
module.exports = function(iconPath, title, level, goal, time, timelimit, xp) {
  this.iconPath = iconPath;
  this.title = title;
  this.level = level;
  this.goal = goal;
  this.time = time;
  this.timelimit = timelimit;
  this.xp = xp;

  /**
   * Sends an embedded skill in the chat
   * @param client
   * @param channel
   */
  this.send = async function(client, channel) {
    //Define message attachment files
    const badgeIcon = await badge(this.iconPath, this.level, "eliteHex.png");
    const badgeFile = new MessageAttachment(badgeIcon, "badge.png");

    //Create embedded messages
    const embed = new MessageEmbed()
      .setColor("#7d005d")
      .setTitle(this.title)
      .setThumbnail("attachment://badge.png")
      .addFields(
        {name: "GOAL: ", value: "```" + `${this.goal} (${this.time})` + "```"},
        {name: "TIME: ", value: "```" + `${this.timelimit}` + "```"},
        {name: "XP: ", value: "```diff\n" + `+ ${this.xp}XP` + "```"},
      )
      .setTimestamp();
    channel.send({embeds: [embed], files: [badgeFile]});
  };

  return this;
};
