
const {MessageEmbed} = require("discord.js");
const {splitToN} = require("../../modules/UIHelper");
const {createLargeSwipePanel} = require("../../modules/menuHelper");
const ListPage = require("../../objects/listPage");
const {getUser, authUser} = require("../../modules/userAPIHelper");

/**
 * Inventory command, every item the user has in a swipeable menu
 */
exports.run = (client, message, args, level) => { // eslint-disable-line no-unused-vars
  //Validate user exists
  authUser(message.author.id, message.channel,(userID) => {
    //Get user profile
    getUser(userID, message.author.username, user => {
      //Display profile
      displayInventory(client, user, message);
    });
  });
};

/**
 * Send embedded message of every item
 * @param client
 * @param user
 * @param message
 * @return {Promise<*>}
 */
function displayInventory(client, user, message) {
  if (user.items.length === 0) {
    const embed = new MessageEmbed()
      .setTitle("INVENTORY 🎒")
      .setColor("#1071E5")
      .setDescription("```Empty```");

    return message.channel.send({embeds: [embed]});
  } else {
    const items = splitToN(user.items, 10);
    const itemPages = [];
    for (let i = 0; i < items.length; i++) {
      itemPages.push(new ListPage("INVENTORY 🎒",items[i]));
    }
    createLargeSwipePanel(client, message, itemPages);
  }
}

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["inventory"],
  permLevel: "User"
};

exports.help = {
  name: "inv",
  category: "Skill Tree",
  description: "Displays your inventory",
  usage: "inv"
};
