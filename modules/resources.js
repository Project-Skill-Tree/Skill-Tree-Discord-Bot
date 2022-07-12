const { MessageEmbed } = require("discord.js");
const Discord = require("discord.js");
const { cleanNull } = require("./cleanNull.js");

/** @module resources */

/**
 * Allows easier embed construction and provides a greater degree of easy customization
 * @Class Resource
 */

class Resource {
  constructor(options) {
    this.color = options.color;
    this.emote = options.emote;
  }

  /**
   * Returns embed message options based on the parameters provided
   * @param {object} options - parameters and values for the embed, as well as additional message options like components and ephemeral
   * most object keys are obtained from the direct dJS function counterpart, eg: { title: "" } is from .setTitle("")
   * { authorIconURL: "" } is from .setAuthor({ iconURL: "" })
   * 
   * Given below are a few examples:
   *
   * .setDescription() => { description: "" }
   * .setColor() => { color: "" } ?? Resource().color 
   * The colors use the pre-defined color attr by default, as this allows for more uniformity between the different types of embeds (success embeds, error embeds, etc)
   * .setImage() => { imageURL: "" }
   * .setThumbnail() => { thumbnailURL: "" }
   * .setAuthor({ name: "", iconURL: "", url: "" }) => { authorName: "", authorIconURL: "", authorURL: "" }
   * .setFooter({ text: "", iconURL: "" }) => { footerText: "", footerIconURL: "" }
   * .addFields({ name: "Title 1", value: "Value 1", inline: true }, { name: "Title 2", value: "Value 2", inline: true }) => { fieldNames: ["Title 1", "Title 2"], fieldValues: ["Value 1", "Value 2"], inlines: [true, true]}
   *
   * Sample usage:
   *
   * const success = new Resource({ color: "#8C33FF", emote: "<:success:983285649660596224>" }); // Uou must override success into default interaction.reply() prototype
   *
   * const row = new MessageActionRow()
   *	.addComponents(
   *		new MessageButton()
   *		.setCustomId('primary')
   *   		.setLabel('Primary')
   * 		.setStyle('PRIMARY'),
   * 	);
   * await interaction.reply({ title: "Hola!", description: "¿Como estas?", components: [row] });
   * 
   * Output: https://imgur.com/a/THUZfLI
   *
   * @return {object}
   */

  embed = (options) => {
    //If options is a string, it's the content
    if (typeof options === "string" || options.embeds || options.content)
      return options;

    const msg = options.msg;
    let title = "";

    if ("emote" in options) title = `${options.emote}・`;
    else if (this.emote !== undefined) title = `${this.emote}・`;

    title += cleanNull(options.title);

    if (options.title === undefined) title = "";

    const embed = new MessageEmbed()
      .setTitle(title)
      .setURL(cleanNull(options.url))
      .setDescription(cleanNull(options.description))
      .setColor(options.color ?? this.color)
      .setImage(options.imageURL)
      .setThumbnail(options.thumbnailURL)
      .setTimestamp();

    embed.setAuthor({
        name: cleanNull(options.authorName),
        iconURL: cleanNull(options.authorIconURL),
        url: cleanNull(options.authorURL),
    });

    embed.setFooter({
        text: cleanNull(options.footerText),
        iconURL: cleanNull(options.footerIconURL),
    });

    const fieldNames = cleanNull(options.fieldNames, "array");
    const fieldValues = cleanNull(options.fieldValues, "array");
    const inlines = cleanNull(options.inlines, "array");

    for (let i = 0; i < fieldNames.length; i++)
      embed.addField(fieldNames[i], fieldValues[i], inlines[i]);

    if (options.embed === true) return embed;

    const messageOptions = {
      content: options.content,
      embeds: [embed],
      reply: options.reply,
      tts: cleanNull(options.tts, "boolean"),
      files: cleanNull(options.files, "array"),
      components: cleanNull(options.components, "array"),
      resources: true,
      ephemeral: cleanNull(options.ephemeral, "boolean"),
    };

    return messageOptions;
  };
}

const successC = "#8C33FF";
const errorC = "#F03350";

const successE = "<:success:983285649660596224>";
const errorE = "<:error:983285167307235328>";

module.exports = {
  emotes: {
    successC: successC,
    errorC: errorC,
    successE: successE,
    errorE: errorE,
  },
  success: new Resource({ color: successC, emote: successE }),
  error: new Resource({ color: errorC, emote: errorE }),
};
