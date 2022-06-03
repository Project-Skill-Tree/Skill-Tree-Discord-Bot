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
   * @param channel - channel to send the message in
   * @param out
   * @param settings
   */
  async start(channel, out, settings) {
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

    const message = await channel.send({embeds: [embed], components: this.components});

    if (index === settings.length) return;

    const next = () => {settings[index+1].start(channel, out, settings);};

    if (this.components) {
      const collector = message.channel.createMessageComponentCollector({time: 60000});
      collector.on("collect", async i => {
        const choice = i.component.label;
        this.onComplete(choice, out, next);
      });
    }

    if (this.filter) {
      this.filter(message, this.onComplete, next, out);
    }
  }
}


module.exports = Setting;
