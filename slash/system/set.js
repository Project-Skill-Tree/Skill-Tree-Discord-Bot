// This command is to modify/edit guild configuration. Perm Level 3 for admins
// and owners only. Used for changing prefixes and role names and such.

// Note that there's no "checks" in this basic version - no config "types" like
// Role, String, Int, etc... It's basic, to be extended with your deft hands!

// Note the **destructuring** here. instead of `args` we have :
// [action, key, ...value]
// This gives us the equivalent of either:
// const action = args[0]; const key = args[1]; const value = args.slice(2);
// OR the same as:
// const [action, key, ...value] = args;
const { codeBlock } = require("@discordjs/builders");
const settings = require("../../modules/settings.js");
const {createYesNoPanel} = require("../../modules/menuHelper");
const {MessageEmbed} = require("discord.js");
const {MessageAttachment} = require("discord.js");
const {imageToBuffer} = require("../../modules/UIHelper");

//[action, key, ...value]
exports.run = async (client, interaction) => { // eslint-disable-line no-unused-vars
  await interaction.deferReply({ephemeral: interaction.settings.hidden});

  if (!interaction.guild.id) {
    await interaction.editReply("Set can only be used in a server");
    return;
  }
  // Retrieve current guild settings (merged) and overrides only.
  const serverSettings = interaction.settings;
  const defaults = settings.get("default");
  const overrides = settings.get(interaction.guild.id);
  const replying = serverSettings.commandReply;
  if (!settings.has(interaction.guild.id)) {
    console.log("setting not found:", interaction.guild.id);
    await settings.set(interaction.guild.id, {});
  }

  const action = interaction.options.getSubcommand();

  // Edit an existing key value
  if (action === "edit") {
    const key = interaction.options.get("key").value;
    const value = interaction.options.get("value").value;

    // User must specify a key.
    if (!key) {
      return await interaction.editReply({
        content: "Please specify a key to edit",
        allowedMentions: {repliedUser: (replying === "true")}
      });
    }
    // User must specify a key that actually exists!
    if (!defaults[key]) {
      return await interaction.editReply({
        content: "This key does not exist in the settings",
        allowedMentions: {repliedUser: (replying === "true")}
      });
    }
    // User must specify a value to change.
    if (value.length < 1) {
      return await interaction.editReply({
        content: "Please specify a new value",
        allowedMentions: {repliedUser: (replying === "true")}
      });
    }
    // User must specify a different value than the current one.
    if (value === serverSettings[key]) {
      return await interaction.editReply({
        content: "This setting already has that value!",
        allowedMentions: {repliedUser: (replying === "true")}
      });
    }

    // Modify the guild overrides directly.
    await settings.set(interaction.guild.id, value, key);

    // Confirm everything is fine!
    await interaction.editReply({
      content: `${key} successfully edited to ${value}`,
      allowedMentions: {repliedUser: (replying === "true")}
    });
  } else
  // Resets a key to the default value
  if (action === "reset") {
    const key = interaction.options.get("key").value;
    if (!key) return await interaction.editReply({
      content: "Please specify a key to reset.",
      allowedMentions: {repliedUser: (replying === "true")}
    });
    if (!defaults[key]) return await interaction.editReply({
      content: "This key does not exist in the settings",
      allowedMentions: {repliedUser: (replying === "true")}
    });
    if (!overrides[key]) return await interaction.editReply({
      content: "This key does not have an override and is already using defaults.",
      allowedMentions: {repliedUser: (replying === "true")}
    });

    // Good demonstration of the custom awaitReply method in `./modules/functions.js` !
    const settingsIcon = await imageToBuffer("icons/settings.png", 300);
    const imageFile = new MessageAttachment(settingsIcon, "settings.png");

    const defaultSettings = await settings.get("default");
    const defaultValue = defaultSettings[key];
    const embed = new MessageEmbed();
    embed.setColor("#fc9803");
    embed.setThumbnail("attachment://settings.png");
    embed.setTitle("Are you sure?");
    embed.setDescription(`Are you sure you want to reset \`${key}\` to the default value?\n`+
    `The default value is \`${defaultValue}\``);
    const success = await createYesNoPanel(interaction, embed, [imageFile]);

    // If they respond with y or yes, continue.
    if (success) {
      // We delete the `key` here.
      await settings.set(interaction.guild.id, defaultValue, key);
      await interaction.editReply({
        content: `${key} was successfully reset to default.`,
        allowedMentions: {repliedUser: (replying === "true"),embeds: [], components: []}
      });
    } else
      await interaction.editReply({
        content: `Your setting for \`${key}\` remains at \`${serverSettings[key]}\``,
        allowedMentions: {repliedUser: (replying === "true"),embeds: [], components: []}
      });
  }
  else {
    // Otherwise, the default action is to return the whole configuration;
    const array = [];
    Object.entries(serverSettings).forEach(([key, value]) => {
      array.push(`${key}${" ".repeat(20 - key.length)}::  ${value}`);
    });
    await interaction.editReply(codeBlock("asciidoc", `= Current Guild Settings =
${array.join("\n")}`));
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["setting", "settings", "conf"],
  permLevel: "Administrator"
};

exports.commandData = {
  name: "set",
  description: "View/Edit/Reset bot server settings",
  type: 1,
  options: [
    {
      name: "view",
      description: "Edit server permission",
      type: 1,
      required: false,
    },
    {
      name: "edit",
      description: "Edit server permission",
      type: 1,
      required: false,
      options: [
        {
          name: "key",
          description: "key",
          type: "STRING",
          required: true,
        },
        {
          name: "value",
          description: "value",
          type: "STRING",
          required: true,
        }
      ]
    },
    {
      name: "reset",
      description: "Edit server permission",
      type: 1,
      required: false,
      options: [
        {
          name: "key",
          description: "key",
          type: "STRING",
          required: true,
        },
      ]
    },
  ],
  defaultPermission: true,
  category: "Miscellaneous",
};