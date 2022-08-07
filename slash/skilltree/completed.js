const { authUser, getCompleted, eraseCompleted } = require("../../modules/userAPIHelper");
const { splitToN } = require("../../modules/UIHelper");
const ListPage = require("../../objects/listPage");
const { createLargeMultiActionSwipePanel } = require("../../modules/menuHelper");
const { replies } = require("../../config.js");

/**
 * Sends a swipeable list of all the user's available skills
 */
exports.run = async (client, interaction) => {
  await interaction.deferReply({ephemeral: interaction.settings.hidden});

  //Validate user exists
  const userID = await authUser(interaction.user.id);
  //Error if no account found
  if (!userID)
    return await interaction.editReplyError(replies.noAccountError);
    
  //Get completed skills
  const completed = await getCompleted(userID);
  showCompleted(client, interaction, userID, completed);
};

async function showCompleted(client, interaction, userID, completed) {
  if (completed.length === 0)
    return await interaction.editReply({
      emoji: "🎒",
      title: "Your completed skills:",
      description: "Looks like you haven't completed any skills yet..."
    });

  else {
    const list = splitToN(completed, 10);
    const listPages = [];
    for (let i = 0; i < list.length; i++) {
      listPages.push(new ListPage("COMPLETED", list[i]));
    }
    createLargeMultiActionSwipePanel(client, interaction, listPages,
      listPages.map(page => {
        return page.list.map(obj => {
          return {
            name: obj.getName(),
            description: "Erase data and revoke XP",
            action: async (toErase) => {
              await eraseCompleted(userID, toErase);
              return true;
            }
          };
        });
      }));
  }
}

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};

exports.commandData = {
  name: "completed",
  description: "Allows you to view completed skills and remove them and subtract their XP",
  options: [],
  defaultPermission: true,
  category: "Skill Tree",
};