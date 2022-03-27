const {MessageEmbed, MessageAttachment} = require("discord.js");
const badge = require("../objects/badge");
const Swipeable = require("./swipeable");
const logging = require("../modules/logger");

/**
 * Skill Object
 * @param iconPath - image path for the icon to be displayed, relative to "/icons/" folder
 * @param title - Skill title (READING III)
 * @param goal - The success condition for the skill to be complete
 * @param time - The time frequency of which to perform the skill
 * @param timelimit - The time limit of which you need to maintain the skill before aquiring it
 * @param xp - The amount of XP granted upon completion of the skill
 * @returns {exports}
 */
class Skill extends Swipeable {
  constructor(iconPath, title, level, goal, time, timelimit, xp) {
    super();
    this.iconPath = iconPath;
    this.title = title;
    this.level = level;
    this.goal = goal;
    this.time = time;
    this.timelimit = timelimit;
    this.xp = xp;
  }

  /**
     * Sends an embedded skill in the chat
     * @param channel
     */
  async send(channel) {
    //Define message attachment files
    const badgeIcon = await badge(this.iconPath, this.level, "advanced.png");
    const badgeFile = new MessageAttachment(badgeIcon, "badge.png");
    const files = [badgeFile];

    //Create embedded messages
    const embed = this.update(new MessageEmbed());

    //Create message button
    /*const row = new MessageActionRow()
      .addComponents(
        new MessageButton()
          .setCustomId("left")
          .setLabel("<")
          .setStyle("PRIMARY")
          .setDisabled(true),
        new MessageButton()
          .setCustomId("right")
          .setLabel(">")
          .setStyle("PRIMARY")
          .setDisabled(true),
      );

    client.on('interactionCreate', interaction => {
      if (!interaction.isButton()) return;
      const filter = i => i.customId === "left" && i.user.id === msg.author.id;
      const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });
      collector.on('collect', async i => {
        if (i.customId === 'primary') {
          await i.deferUpdate();
          await wait(4000);
          await i.editReply({ content: 'A button was clicked!', components: [] });
        }
      });
    });*/
    //components: [row]
    return channel.send({embeds: [embed], files: files});
  }

  /**
   * Updates properties of embed with values from this class
   * @param embed
   */
  update(embed) {
    logging.log("update");
    embed.setColor("#7d005d");
    embed.setTitle(this.title);
    embed.setThumbnail("attachment://badge.png");
    embed.addFields({name: "GOAL: ", value: "```" + `${this.goal} (${this.time})` + "```"},
      {name: "TIME: ", value: "```" + `${this.timelimit}` + "```"},
      {name: "XP: ", value: "```diff\n" + `+ ${this.xp}XP` + "```"});
    embed.setTimestamp();
    return embed;
  }
}

module.exports = Skill;
