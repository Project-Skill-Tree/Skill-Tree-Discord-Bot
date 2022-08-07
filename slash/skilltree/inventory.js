
const { splitToN } = require("../../modules/UIHelper");
const { createLargeSwipePanel } = require("../../modules/menuHelper");
const ListPage = require("../../objects/listPage");
const { getUser, authUser } = require("../../modules/userAPIHelper");
const { replies } = require("../../config.js");

/**
 * Inventory command, every item the user has in a swipeable menu
 */
exports.run = async (client, interaction) => { // eslint-disable-line no-unused-vars
  await interaction.deferReply({ephemeral: interaction.settings.hidden});

  //Validate user exists
  const userID = await authUser(interaction.user.id);
  //Error if no account found
  if (!userID)
    return await interaction.editReplyError(replies.noAccountError);

  const user = await getUser(userID, interaction.user.username);
  await displayInventory(client, user, interaction);
};

/**
 * Send embedded message of every item
 * @param client
 * @param user
 * @param interaction
 * @return {Promise<*>}
 */
async function displayInventory(client, user, interaction) {
  if (user.items.length === 0)
    return await interaction.editReply({
      emoji: "🎒",
      title: "Your inventory:",
      description: "Looks like your inventory is empty..."
    });

  else {
    const items = splitToN(user.items, 10);
    const itemPages = [];
    for (let i = 0; i < items.length; i++) {
      itemPages.push(new ListPage("INVENTORY 🎒", items[i]));
    }
    createLargeSwipePanel(client, interaction, itemPages);
  }
}

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["inventory"],
  permLevel: "User"
};

exports.commandData = {
  name: "inv",
  description: "Displays your inventory",
  options: [],
  defaultPermission: true,
  category: "Skill Tree",
};
