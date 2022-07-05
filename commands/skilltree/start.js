const {createLargeSwipePanel, createYesNoPanel} = require("../../modules/menuHelper");
const {getAvailable, start, skip, revert} = require("../../modules/skillAPIHelper");
const {authUser} = require("../../modules/userAPIHelper");
const Challenge = require("../../objects/challenge");
const {MessageEmbed} = require("discord.js");

/**
 * Sends a swipeable list of all the user's available skills
 */
exports.run = (client, message) => {
  //Validate user exists
  authUser(message.author.id, message.channel,(userID) => {
    startMenu(client, message, userID);
  });
};

function startMenu(client, message, userID) {
  //Get available skills
  getAvailable(userID, skills => { // gets available,not started skills
    if (skills.length === 0) {
      message.channel
        .send("```You have no available skills. Use ~tasks to see what skills you have started```")
        .then(msg => {
          setTimeout(() => msg.delete(), 10000);
        });
      return;
    }
    //Create panel showing skills
    createLargeSwipePanel(client, message, skills,
      [{
        name: "START",
        description: "Start a skill and add it to your current skills",
        action: async (toStart) => {
          const res = await start(userID, toStart);
          if (res === 201) {
            message.channel
              .send("```Error: A maximum of 25 skills/challenges can be active at any one time. Please "+`${message.settings.prefix}cancel` +" ongoing skills```")
              .then(msg => {
                setTimeout(() => msg.delete(), 10000);
              });
            return false;
          }
          return true;
        }
      },{
        name: "SKIP",
        description: "Skip the skill and unlock all its children",
        action: async (toSkip) => {
          //Cannot skip challenges
          if (toSkip instanceof Challenge) {
            message.channel
              .send("```Error: Challenges cannot be skipped```")
              .then(msg => {
                setTimeout(() => msg.delete(), 10000);
              });
            return true;
          }
          await skip(userID, toSkip);
          return true;
        }
      },{
        name: "REVERT",
        description: "Revert this skill to its parent",
        action: async (toRevert) => {
          if (toRevert.requires.length === 0) {
            message.channel
              .send("```Error: This is a starting skill and cannot be reverted```")
              .then(msg => {
                setTimeout(() => msg.delete(), 10000);
              });
            return true;
          }
          const embed = new MessageEmbed()
            .setTitle("WARNING")
            .setColor("#ba1b06")
            .setDescription("WARNING: This will revert to the previous skill, " +
              "removing its parent skill from your completed/ongoing skills. " +
              "You will need to skip or complete it again to show it in your profile." +
              "\n(This will not affect XP or ongoing/completed skills unlocked by the parent)");
          const msg = await message.channel.send({embeds: [embed]});
          await createYesNoPanel(msg,
            message.client,
            async () => {
              await revert(userID, toRevert);
            },
            () => {});
          return true;
        }
      }], () => {
        startMenu(client, message, userID);
      });
  });
}

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["skip", "revert"],
  permLevel: "User"
};

exports.help = {
  name: "start",
  category: "Skill Tree",
  description: "Displays all of your available skills and allows you to start them",
  usage: "start"
};
