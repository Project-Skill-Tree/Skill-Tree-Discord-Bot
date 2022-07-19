const {getUser, authUser} = require("../../modules/userAPIHelper");
const {displayProfile} = require("../../modules/profileRenderer");

/**
 * Profile command, authenticates user and displays their profile
 *
 */
exports.run = async (client, interaction) => { // eslint-disable-line no-unused-vars
  //Validate user exists
  const userID = await authUser(interaction.user.id, interaction.channel);
  if (!userID) {
    await interaction.reply({content: "```Error: Please create an account with ~setup```", ephemeral: true});
    return;
  }

  const userProfile = await getUser(userID, interaction.user.username);
  displayProfile(userProfile, interaction.channel);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "profile",
  category: "Skill Tree",
  description: "Displays your character profile, XP, level, badges and more",
  usage: "profile"
};
