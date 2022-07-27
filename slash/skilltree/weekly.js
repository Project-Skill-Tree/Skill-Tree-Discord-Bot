const {getRecentTasks} = require("../../modules/skillAPIHelper");
const {displayReview} = require("../../modules/weeklyReviewRenderer");
const {getUser, authUser} = require("../../modules/userAPIHelper");

/**
 * #TODO TEST METHOD - DELETE ON RELEASE
 * @param client
 * @param interaction
 */
exports.run = async (client, interaction) => {
  await interaction.deferReply({ephemeral: true});

  //Validate user exists
  const userID = await authUser(interaction.user.id, interaction.channel);
  if (!userID) {
    await interaction.reply({content: "```Error: Please create an account with ~setup```", ephemeral: true});
    return;
  }

  const user = await getUser(userID, interaction.user.username);
  const tasks = getRecentTasks(userID, 7);
  //Display weekly analytics
  displayReview(user, interaction, tasks);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "Bot Admin"
};

exports.commandData = {
  name: "weekly",
  description: "Displays a weekly report for testing",
  options: [],
  defaultPermission: true,
  category: "Skill Tree",
};