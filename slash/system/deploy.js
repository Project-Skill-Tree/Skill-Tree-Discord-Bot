exports.run = async (client, interaction) => {
  await interaction.deferReply({ephemeral: true});
  // We'll partition the slash commands based on the guildOnly boolean.
  // Separating them into the correct objects defined in the array below.
  const globalCmds = client.container.slashcmds.filter(c => !c.conf.guildOnly);

  // Give the user a notification the commands are deploying.
  await interaction.editReply("Deploying commands!");

  // Then set the global commands like
  await client.application?.commands.set(globalCmds.map(c => c.commandData)).catch(e => console.log(e));

  // Reply to the user that the commands have been deployed.
  await interaction.editReply("All commands deployed!");
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "Bot Owner"
};

exports.commandData = {
  name: "deploy",
  description: "This will deploy all slash commands.",
  options: [],
  defaultPermission: true,
};
