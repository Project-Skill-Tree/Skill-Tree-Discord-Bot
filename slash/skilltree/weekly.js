const {getRecentTasks} = require("../../modules/skillAPIHelper");
const {displayReview} = require("../../modules/weeklyReviewRenderer");
const {getUser, authUser} = require("../../modules/userAPIHelper");

/**
 * @param client
 * @param interaction
 */
exports.run = async (client, interaction) => {
  await interaction.deferReply({ephemeral: interaction.settings.hidden});

  //Validate user exists
  const userID = await authUser(interaction.user.id, interaction.channel);
  if (!userID) {
    await interaction.editReply({content: "```Error: Please create an account with /setup```", ephemeral: true});
    return;
  }

  const user = await getUser(userID, null);
  const discorduser = await client.users.fetch(user.discordid);
  user.username = discorduser.username;
  const tasks = await getRecentTasks(userID, 7);
  //Display weekly analytics
  displayReview(user, interaction.channel, tasks);
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