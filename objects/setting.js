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
   * @param oldMessage - previous message
   * @param channel - channel to send the message in
   * @param out
   * @param settings
   */
  async start(oldMessage, channel, out, settings) {
    const index = settings.indexOf(this);

    const embed = new MessageEmbed()
      .setTitle(this.title)
      .setDescription(this.description)
      .setColor(`#${Configurations().primary}`);
    if (index === settings.length) {
      embed.setFooter("Setup complete");
    } else {
      embed.setFooter(`Completion Status: \n (${index}/${settings.length})`);
    }

    let message;
    if (oldMessage) {
      message = await oldMessage.edit({embeds: [embed], components: this.components});
    } else {
      message = await channel.send({embeds: [embed], components: this.components});
    }

    if (index === settings.length) return;

    const next = function() {
      settings[index+1].start(message, channel, out, settings);
    };
    if (this.components) {
      const filter = (m) => {
        return m.message.id === message.id;
      };
      const collector = message.channel.createMessageComponentCollector({filter});
      collector.on("collect", async i => {

        const choice = i.component.label;
        this.onComplete(choice, out, next);
        collector.stop();
        if (!i.deferred) {
          await i.deferUpdate();
        }
      });
    }

    if (this.filter) {
      this.filter(message, this.onComplete, next, out);
    }
  }
}


module.exports = Setting;
