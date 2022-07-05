const { MessageEmbed } = require("discord.js");
const Discord = require("discord.js");
const { cleanNull } = require("./cleanNull.js");

class Resource {
  constructor(options) {
    this.color = options.color;
    this.emote = options.emote;
  }

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