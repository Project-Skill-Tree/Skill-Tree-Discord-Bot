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
   * Sends title message to check for DMs being disabled
   * @param message - User message
   * @param channel - channel to send error in
   * @param onFailure - onFailure case when user has DMs disabled
   * @param callback - callback to execute on completion
   * @return {Promise<void>}
   */
  async sendInitMessage(message, channel, onFailure, callback) {
    const embed = new MessageEmbed()
      .setTitle(this.title)
      .setDescription(this.description)
      .setColor(`#${Configurations().primary}`);

    let initMessage;
    try {
      initMessage = await channel.send({embeds: [embed], components: this.components});
    } catch (e) {
      // messages in the same channel saying your DMs are disabled
      const errorMsg = await message.channel.send(
        `<@${message.member.id}> Your DMs are Disabled. Please enable them and try again ` +
        "(You can turn this setting off afterwards, we need to do this to prevent spam)\n" +
        "**HOW TO ENABLE DMS**```" +
        "1) Right-click server icon\n" +
        "2) Click on Privacy Settings\n" +
        "3) Toggle \"Allow direct messages from server members\" on\n" +
        "4) press Done```");
      setTimeout(() => errorMsg.delete(),10000);
      onFailure();
      if (initMessage) {
        initMessage.delete();
      }
    }

    const collector = initMessage.channel.createMessageComponentCollector({time: 120000});
    collector.on("collect", async i => {
      await i.deferUpdate();
      callback(initMessage);
      collector.stop();
    });
  }
  /**
   * Sends an embedded skill in the chat
   * @param oldMessage - previous message
   * @param channel - channel to send the message in
   * @param userSettings - {} list of current user settings
   * @param settings - list of setting objects
   */
  async start(oldMessage, channel, userSettings, settings) {
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

    let message;
    if (oldMessage) {
      message = await oldMessage.edit({embeds: [embed], components: this.components});
    } else {
      message = await channel.send({embeds: [embed], components: this.components});
    }

    if (index === settings.length) return;

    const next = function() {
      settings[index+1].start(message, channel, userSettings, settings);
    };
    if (this.components) {
      const filter = (m) => {
        return m.message.id === message.id;
      };
      const collector = message.channel.createMessageComponentCollector({filter, time: 120000});
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
