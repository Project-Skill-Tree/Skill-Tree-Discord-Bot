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
module.exports = function(name, link) {
  this.name = name;
  this.link = link;

  /**
   * Embeds a skill and sends it in the chat
   * @param client
   * @param channel
   */
  this.embedItem = function(client, channel) {
    const overseer = new MessageAttachment("./assets/characters/overseer.png", "overseer.png");
    const embed = new MessageEmbed()
      .setColor("#e38827")
      .setTitle("```[ITEM FOUND]```")
      .setDescription(`++[${this.name}](${this.link})`)
      .setAuthor(client.user.username, "attachment://overseer.png")
      .setTimestamp();
    channel.send({ embeds: [embed] , files:[overseer]});
  };

  return this;
};
