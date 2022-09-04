const {createLargeSwipePanel} = require("../../modules/menuHelper");
const {getInProgress, cancel} = require("../../modules/skillAPIHelper");
const {authUser} = require("../../modules/userAPIHelper");

/**
 * Sends a swipeable list of all the user's available skills
 */
exports.run = async (client, interaction) => {
  await interaction.deferReply({ephemeral: interaction.settings.hidden});

  //Validate user exists
  const userID = await authUser(interaction.user.id);
  //Error if no account found
  if (!userID) {
    await interaction.editReply("```Error: Please create an account with /setup```");
    return;
  }

  //Get ongoing skills
  const skills = await getInProgress(userID);
  if (skills.length === 0) {
    await interaction.editReply("```You have no ongoing skills. Use /start to see which skills are available to you```");
    return;
  }
  //Create panel showing skills
  await createLargeSwipePanel(client, interaction, skills,
    [{
      name: "CANCEL",
      description: "Cancel the skill",
      action: skill => {
        cancel(userID, skill);
        return true;
      }
    }]);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};

exports.commandData = {
  name: "cancel",
  description: "Allows you to cancel on-going skills",
  options: [],
  defaultPermission: true,
  category: "Skill Tree",
};

