/*
The HELP command is used to display every command's name and description
to the user, so that he may see what commands are available. The help
command is also filtered by level, so if a user does not have access to
a command, it is not shown to them. If a command name is given with the
help command, its extended help is shown.
*/
const { codeBlock } = require("@discordjs/builders");
const { toProperCase } = require("../../modules/functions.js");
const {MessageActionRow, MessageButton} = require("discord.js");

exports.run = async (client, interaction) => {
  await interaction.deferReply({ephemeral: interaction.settings.hidden});

  // Grab the container from the client to reduce line length.
  const {container} = client;

  // Filter all commands by which are available for the user's level, using the <Collection>.filter() method.
  const myCommands = interaction.guild ? container.slashcmds.filter(cmd => container.levelCache[cmd.conf.permLevel] <= interaction.level) :
    container.slashcmds.filter(cmd => container.levelCache[cmd.conf.permLevel] <= interaction.level && cmd.conf.guildOnly !== true);

  // Then we will filter the myCommands collection again to get the enabled commands.
  const enabledCommands = myCommands.filter(cmd => cmd.conf.enabled);

  // Here we have to get the command names only, and we use that array to get the longest name.
  const commandNames = [...enabledCommands.keys()];

  // This make the help commands "aligned" in the output.
  const longest = commandNames.reduce((long, str) => Math.max(long, str.length), 0);

  let currentCategory = "";
  let output = "= Command List =\n[Here are all the commands available to your permission level]\n";
  const sorted = enabledCommands.sort((p, c) => p.commandData.category > c.commandData.category ? 1 :
    p.commandData.name > c.commandData.name && p.commandData.category === c.commandData.category ? 1 : -1);

  sorted.forEach(c => {
    const cat = toProperCase(c.commandData.category);
    if (currentCategory !== cat) {
      output += `\u200b\n== ${cat} ==\n`;
      currentCategory = cat;
    }
    output += `/${c.commandData.name}${" ".repeat(longest - c.commandData.name.length)} :: ${c.commandData.description}\n`;
  });

  const buttons = new MessageActionRow()
    .addComponents(
      new MessageButton()
        .setLabel("SKILL TREE DISCORD")
        .setEmoji("984814194207653898")
        .setStyle("LINK")
        .setURL("https://discord.gg/qTvJTTyr2F"),
      new MessageButton()
        .setLabel("PATREON")
        .setStyle("LINK")
        .setEmoji("984812444130115634")
        .setURL("https://www.patreon.com/project_skilltree"),
      new MessageButton()
        .setLabel("FEEDBACK")
        .setStyle("LINK")
        .setEmoji("984816056629604362")
        .setURL("https://forms.gle/dF1vcGV3NEMcd5Zm6"));

  await interaction.editReply({content: `${codeBlock("asciidoc", output)}`, components: [buttons]});
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["h", "halp"],
  permLevel: "User"
};

exports.commandData = {
  name: "help",
  description: "Displays all the available commands for your permission level.",
  options: [],
  defaultPermission: true,
  category: "Miscellaneous",
};
