
const {MessageEmbed} = require("discord.js");
const {splitToN} = require("../../modules/UIHelper");
const {createLargeSwipePanel} = require("../../modules/menuHelper");
const ListPage = require("../../objects/listPage");
const {getUser, authUser} = require("../../modules/userAPIHelper");

/**
 * Inventory command, every item the user has in a swipeable menu
 */
exports.run = async (client, interaction) => { // eslint-disable-line no-unused-vars
  await interaction.deferReply({ephemeral: true});

  //Validate user exists
  const userID = await authUser(interaction.user.id);
  //Error if no account found
  if (!userID) {
    await interaction.editReply("```Error: Please create an account with ~setup```");
    return;
  }
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
function displayInventory(client, user, interaction) {
  if (user.items.length === 0) {
    const embed = new MessageEmbed()
      .setTitle("INVENTORY 🎒")
      .setColor("#1071E5")
      .setDescription("```Empty```");

    return interaction.editReply({embeds: [embed]});
  } else {
    const items = splitToN(user.items, 10);
    const itemPages = [];
    for (let i = 0; i < items.length; i++) {
      itemPages.push(new ListPage("INVENTORY 🎒",items[i]));
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
};
