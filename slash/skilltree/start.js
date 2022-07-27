const {createLargeSwipePanel, createYesNoPanel} = require("../../modules/menuHelper");
const {getAvailable, start, skip, revert} = require("../../modules/skillAPIHelper");
const {authUser} = require("../../modules/userAPIHelper");
const Challenge = require("../../objects/challenge");
const {MessageEmbed} = require("discord.js");

/**
 * Sends a swipeable list of all the user's available skills
 */
exports.run = async (client, interaction) => {
  await interaction.deferReply({ephemeral: true});

  //Validate user exists
  const userID = await authUser(interaction.user.id);
  //Error if no account found
  if (!userID) {
    await interaction.editReply("```Error: Please create an account with ~setup```");
    return;
  }
  startMenu(client, interaction, userID);
};

async function startMenu(client, interaction, userID) {
  //Get available skills
  const available = await getAvailable(userID);

  if (available.length === 0) {
    await interaction
      .editReply("```You have no available skills. Use ~tasks to see what skills you have started```");
    return;
  }
  //Create panel showing skills
  await createLargeSwipePanel(client, interaction, available,
    [{
      name: "START",
      description: "Start a skill and add it to your current skills",
      action: async (toStart) => {
        const res = await start(userID, toStart);
        if (res === 201) {
          await interaction
            .followUp("```Error: A maximum of 25 skills/challenges can be active at any one time. " +
              "Please " + `${interaction.settings.prefix}cancel` + " ongoing skills```");
          return false;
        }
        if (res === 202) {
          await interaction
            .followUp("```Error: Skill already ongoing, use " +
              `${interaction.settings.prefix}tasks` + " to view ongoing skills```");
          return false;
        }
        return true;
      }
    }, {
      name: "SKIP",
      description: "Skip the skill and unlock all its children",
      action: async (toSkip) => {
        //Cannot skip challenges
        if (toSkip instanceof Challenge) {
          await interaction
            .followUp("```Error: Challenges cannot be skipped```");
          return true;
        }
        const unlocked = await skip(userID, toSkip);
        if (unlocked.length !== 0) {
          createLargeSwipePanel(client, interaction, unlocked);
        }
        return true;
      }
    }, {
      name: "REVERT",
      description: "Revert this skill to its parent",
      action: async (toRevert) => {
        if (toRevert.requires.length === 0) {
          await interaction
            .followUp("```Error: This is a starting skill and cannot be reverted```");
          return true;
        }
        const embed = new MessageEmbed()
          .setTitle("WARNING")
          .setColor("#ba1b06")
          .setDescription("WARNING: This will revert to the previous skill, " +
            "removing its parent skill from your completed/ongoing skills. " +
            "You will need to skip or complete it again to show it in your profile." +
            "\n(This will not affect XP or ongoing/completed skills unlocked by the parent).\n\n" +
            "Do you wish to continue?");
        const msg = await interaction.followUp({embeds: [embed]});
        const res = await createYesNoPanel(msg, interaction.user);
        if (res) await revert(userID, toRevert);
        return true;
      }
    }], () => {
      startMenu(client, interaction, userID);
    });
}

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["skip", "revert"],
  permLevel: "User"
};

exports.commandData = {
  name: "start",
  description: "Displays all of your available skills and allows you to start them",
  options: [],
  defaultPermission: true,
  category: "Skill Tree",
};