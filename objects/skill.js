const {MessageEmbed, MessageAttachment} = require("discord.js");

/**
 * Skill Object
 * @param title - Skill title (READING III)
 * @param goal - The success condition for the skill to be complete
 * @param time - The time frequency of which to perform the skill
 * @param timelimit - The time limit of which you need to maintain the skill before aquiring it
 * @param xp - The amount of XP granted upon completion of the skill
 * @returns {exports}
 */
module.exports = function(title, goal, time, timelimit, xp) {
  this.title = title;
  this.goal = goal;
  this.time = time;
  this.timelimit = timelimit;
  this.xp = xp;

  /**
   * Embeds a skill and sends it in the chat
   * @param client
   * @param channel
   */
  this.embedSkill = function(client, channel) {
    const overseer = new MessageAttachment("./assets/characters/overseer.png", "overseer.png");
    //TODO: Dynamically load skill badges
    const badge = new MessageAttachment("./assets/badges/ReadingIII.png", "badge.png");
    const embed = new MessageEmbed()
      .setColor("#e38827")
      .setTitle(this.title)
      .setURL("https://discord.js.org/")
      //TODO: Implement cloud stored image location
      .setAuthor(client.user.username, "attachment://overseer.png", "https://discord.js.org")
      .setThumbnail("attachment://badge.png")
      .addFields(
        { name: "GOAL: ", value: `${this.goal} (${this.time})`},
        { name: "TIME: ", value: `${this.timelimit}`},
        { name: "XP: ", value: `${this.xp}`},
      )
      .setTimestamp();
    channel.send({ embeds: [embed] , files:[overseer, badge]});
  };

  return this;
};
