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
   * @return {Promise<boolean>}
   * @param client
   * @param interaction
   * @param member
   */
  async sendInitMessage(client, interaction, member) {
    const embed = new MessageEmbed()
      .setTitle(this.title)
      .setDescription(this.description)
      .setColor(`#${Configurations().primary}`);

    let initMessage;
    try {
      initMessage = await member.send({embeds: [embed], components: this.components});
    } catch (e) {
      // messages in the same channel saying your DMs are disabled
      await interaction.editReply(
        `<@${interaction.user.id}> Your DMs are Disabled. Please enable them and try again ` +
        "(You can turn this setting off afterwards)\n" +
        "**HOW TO ENABLE DMS**```" +
        "1) Right-click server icon\n" +
        "2) Click on Privacy Settings\n" +
        "3) Toggle \"Allow direct messages from server members\" on\n" +
        "4) press Done```");
      return Promise.resolve(false);
    }

    const collector = initMessage.createMessageComponentCollector({time: 120000});
    // eslint-disable-next-line no-unused-vars
    return await new Promise((resolve, reject) => {
      collector.on("collect", async i => {
        await i.deferUpdate();
        resolve(true);
        collector.stop();
      });
    });
  }
  /**
   * Sends an embedded skill in the chat
   * @param channel - channel to send the message in
   * @param userSettings - {} list of current user settings
   * @param settings - list of setting objects
   * @param member
   */
  async start(channel, userSettings, settings, member) {
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

    const message = await member.send({embeds: [embed], components: this.components});

    if (index === settings.length) return;

    const next = function() {
      settings[index+1].start(channel, userSettings, settings, member);
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
