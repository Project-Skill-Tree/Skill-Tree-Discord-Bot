const Configurations = require("../modules/botConfigurations");
const {MessageEmbed} = require("discord.js");
const {MessageActionRow, MessageButton} = require("discord.js");

/**
 * Setting object to display the setting and perform the action
 */
class Setting {
  /**
   * Skill constructor
   * @param title - title
   * @param description
   * @param buttons
   * @param filter
   * @param onComplete
   * @constructor
   */
  constructor(title, description, buttons, filter, onComplete) {
    this.title = title;
    this.description = description;
    this.buttons = buttons ?? [];
    this.filter = filter;
    this.onComplete = onComplete;
  }

  /**
   * Sends the setting option in the chat
   * @param interaction - channel to send the message in
   * @param userSettings - {} list of current user settings
   * @param settings - list of setting objects
   */
  async start(interaction, userSettings, settings) {
    const index = settings.indexOf(this);

    const buttons = [...this.buttons];
    if (index !== 0) {
      buttons.unshift(
        new MessageButton().setCustomId("back").setLabel("BACK")
          .setEmoji("<:back:1002582706758090914>").setStyle("PRIMARY")
      );
    }
    const messageActionRow = new MessageActionRow().addComponents(...buttons);
    const embed = new MessageEmbed()
      .setTitle(this.title)
      .setDescription(this.description)
      .setColor(`#${Configurations().primary}`);
    if (index === settings.length) {
      embed.setFooter("Setup complete");
    } else {
      embed.setFooter(`Completion Status: \n (${index+1}/${settings.length})`);
    }

    const message = await interaction.editReply({embeds: [embed], components: [messageActionRow]});

    if (index === settings.length) return;

    const back = function() {
      settings[index-1].start(interaction, userSettings, settings);
    };
    const next = function() {
      settings[index+1].start(interaction, userSettings, settings);
    };
    if (this.buttons) {
      const filter = (i) => {
        return i.message.id === message.id;
      };
      const collector = message.createMessageComponentCollector({filter, time: 120000});
      collector.on("collect", async i => {
        await i.deferUpdate();
        const choice = i.component.label;
        collector.stop();
        if (choice === "BACK") {
          back();
        } else {
          this.onComplete(choice, userSettings, next);
        }
      });
    }

    if (this.filter) {
      this.filter(message, this.onComplete, next, userSettings);
    }
  }
}


module.exports = Setting;
