const {authUser, getCompleted, eraseCompleted} = require("../../modules/userAPIHelper");
const {MessageEmbed} = require("discord.js");
const {splitToN} = require("../../modules/UIHelper");
const ListPage = require("../../objects/listPage");
const {createLargeMultiActionSwipePanel} = require("../../modules/menuHelper");

/**
 * Sends a swipeable list of all the user's available skills
 */
exports.run = (client, message) => {
  //Validate user exists
  authUser(message.author.id, message.channel,(userID) => {
    //Get ongoing skills
    getCompleted(userID, completed => { // gets completed skills
      //Create panel showing skills
      showCompleted(client, message, userID, completed);
    });
  });
};

function showCompleted(client, message, userID, completed) {
  if (completed.length === 0) {
    const embed = new MessageEmbed()
      .setTitle("COMPLETED 🎒")
      .setColor("#1071E5")
      .setDescription("```No skills completed```");

    return message.channel.send({embeds: [embed]});
  } else {
    const list = splitToN(completed, 10);
    const listPages = [];
    for (let i = 0; i < list.length; i++) {
      listPages.push(new ListPage("COMPLETED",list[i]));
    }
    createLargeMultiActionSwipePanel(client, message, listPages,
      listPages.map(page => {
        return page.list.map(obj => {
          return {
            name: obj.getName(),
            description: "Erase data and revoke XP",
            action: async (toErase) => {
              eraseCompleted(userID, toErase);
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

exports.help = {
  name: "completed",
  category: "Skill Tree",
  description: "Allows you to view completed skills and remove them and subtract their XP",
  usage: "completed"
};
