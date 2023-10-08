const logger = require("../modules/logger.js");
const { getSettings, permlevel } = require("../modules/functions.js");
const config = require("../config.js");

module.exports = async (client, interaction) => {

  // If it's not a command, stop.
  if (!interaction.isCommand()) return;

  // Grab the settings for this server from Enmap.
  // If there is no guild, get default conf (DMs)
  const settings = interaction.settings = getSettings(interaction.guild);
  settings.hidden = settings.hidden !== "false";
  if (!interaction.guild) {
    settings.hidden = false;
  }

  // Get the user or member's permission level from the elevation
  const level = permlevel(interaction);
  interaction.level = level;
  
  // Grab the command data from the client.container.slashcmds Collection
  const cmd = client.container.slashcmds.get(interaction.commandName);
  
  // If that command doesn't exist, silently exit and do nothing
  if (!cmd) return;

  // Since the permission system from Discord is rather limited in regarding to
  // Slash Commands, we'll just utilise our permission checker.
  if (level < client.container.levelCache[cmd.conf.permLevel]) {
    // Due to the nature of interactions we **must** respond to them otherwise
    // they will error out because we didn't respond to them.
    return await interaction.reply({
      content: `This command can only be used by ${cmd.conf.permLevel}'s only`,
      // This will basically set the ephemeral response to either announce
      // to everyone, or just the command executioner. But we **HAVE** to 
      // respond.
      ephemeral: settings.systemNotice !== "true"
    });
  }

  // If everything checks out, run the command
  try {
    logger.log(`${config.permLevels.find(l => l.level === level).name} ${interaction.user.id} ran slash command ${interaction.commandName}`, "cmd");
    await cmd.run(client, interaction);
    // await interaction.followUp({
    //   content: "The Skilltree app is now available on " +
    //     "[IOS](<https://apps.apple.com/us/app/skilltree/id6459107901>) " +
    //     "and [ANDROID](<https://play.google.com/store/apps/details?id=com.projectskilltree.skilltree>)! " +
    //     "Make sure to go to the [sign up](https://media.discordapp.net/attachments/939508059758288939/1158868104185659412/image.png?ex=651dcf86&is=651c7e06&hm=f05c122d9048f26cf39bae7edf206f83ed6add580829eaad37da232e0b948824&=&width=421&height=670) " +
    //     "page and then create a new account with discord " +
    //     "(don't worry, it'll automatically sync your data when you sign in), and click 'transfer data' to transfer your bot progress. " +
    //     "\n\nYou won't be able to use the bot again after migrating your account, but don't worry, the app is 100x better anyway. " +
    //     "We'll also shut down the bot in a few weeks, but any existing discord bot accounts " +
    //     "will still be available to migrate indefinitely ", ephemeral: true
    // });
  } catch (e) {
    console.error(e);
    if (interaction.replied)
      await interaction.followUp({ content: `There was a problem with your request.\n\`\`\`${e.message}\`\`\``, ephemeral: true })
        .catch(e => console.error("An error occurred following up on an error", e));
    else 
    if (interaction.deferred)
      await interaction.editReply({ content: `There was a problem with your request.\n\`\`\`${e.message}\`\`\``, ephemeral: true })
        .catch(e => console.error("An error occurred following up on an error", e));
    else 
      await interaction.reply({ content: `There was a problem with your request.\n\`\`\`${e.message}\`\`\``, ephemeral: true })
        .catch(e => console.error("An error occurred replying on an error", e));
  }
};
