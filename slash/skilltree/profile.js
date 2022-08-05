const {getUser, authUser} = require("../../modules/userAPIHelper");
const {displayProfile} = require("../../modules/profileRenderer");

/**
 * Profile command, authenticates user and displays their profile
 *
 */
exports.run = async (client, interaction) => { // eslint-disable-line no-unused-vars
  await interaction.deferReply({ephemeral: interaction.settings.hidden});

  //Validate user exists
  const userID = await authUser(interaction.user.id, interaction.channel);
  if (!userID)
    return await interaction.editReplyError({
      title: "Oops! You don't have an account yet!",
      description: "Please create an account with `~setup` first, before using this command."
    });

  const userProfile = await getUser(userID, interaction.user.username);
  await displayProfile(userProfile, interaction);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};

exports.commandData = {
  name: "profile",
  description: "Displays your character profile, XP, level, badges and more",
  options: [],
  defaultPermission: true,
  category: "Skill Tree",
};
