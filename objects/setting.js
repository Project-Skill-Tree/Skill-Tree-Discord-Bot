const Configurations = require("../modules/botConfigurations");
const {MessageEmbed} = require("discord.js");

/**
 * Setting object to display the setting and perform the action
 */
class Setting {
  /**
   * Skill constructor
   * @param title - title
   * @param description
   * @param components
   * @param filter
   * @param onComplete
   * @constructor
   */
  constructor(title, description, components, filter, onComplete) {
    this.title = title;
    this.description = description;
    this.components = components == null ? [] : [components];
    this.filter = filter;
    this.onComplete = onComplete;
  }

  /**
   * Sends an embedded skill in the chat
   * @param interaction - channel to send the message in
   * @param userSettings - {} list of current user settings
   * @param settings - list of setting objects
   */
  async start(interaction, userSettings, settings) {
    const index = settings.indexOf(this);

    const embed = new MessageEmbed()
      .setTitle(this.title)
      .setDescription(this.description)
      .setColor(`#${Configurations().primary}`);
    if (index === settings.length) {
      embed.setFooter("Setup complete");
    } else {
      embed.setFooter(`Completion Status: \n (${index+1}/${settings.length})`);
    }

    const message = await interaction.editReply({embeds: [embed], components: this.components});

    if (index === settings.length) return;

    const next = function() {
      settings[index+1].start(interaction, userSettings, settings);
    };
    if (this.components) {
      const filter = (m) => {
        return m.message.id === message.id;
      };
      const collector = message.createMessageComponentCollector({filter, time: 120000});
      collector.on("collect", async i => {
        try {
          await i.deferUpdate();
        } catch (e) {} // eslint-disable-line no-empty
        const choice = i.component.label;
        collector.stop();
        this.onComplete(choice, userSettings, next);
      });
    }

    if (this.filter) {
      this.filter(message, this.onComplete, next, userSettings);
    }
  }
}


module.exports = Setting;
