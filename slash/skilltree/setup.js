/* eslint-disable no-case-declarations */
const { MessageEmbed, MessageActionRow, MessageButton} = require("discord.js");
const { createUser, updateUser, authUser} = require("../../modules/userAPIHelper");
const Configurations = require("../../modules/botConfigurations");
const {timezoneFromLocation} = require("../../modules/timezoneHelper");
const {locationConfirmation} = require("./timezone");
const Setting = require("../../objects/setting");
const {createLargeSwipePanel} = require("../../modules/menuHelper");

/**
 * Setup user account
 * Page 1. Info page
 * Page 2. Set experience level (beginner/intermeditae/expert)
 * Page 3. DM reminders
 * Page 4. Choose your character (male/female)
 * Page 5. Select your timezone
 * Page 6. Complete confirmation
 */
exports.run = async (client, interaction) => {
  await interaction.deferReply({ephemeral: true});

  if (interaction.member != null) {
    //Send notification reply to user
    await interaction.editReply(":thumbsup: Message with further instruction has been sent to your DMs!");
  }

  //Send init message to check chat is available
  const member = await client.users.cache.get(interaction.user.id);
  const init = await getSettings(client, interaction, false, member);
  const success = await init[0].sendInitMessage(client, interaction, member);
  if (success) {
    await startSetup(client, interaction, member);
  }
};

async function startSetup(client, interaction, member) {
  //Validate user exists
  const userID = await authUser(interaction.user.id);

  let settings = await getSettings(client, interaction, userID, member);
  if (userID) {
    settings = settings.filter(s => s.title !== "Set Experience Level");
  }
  settings[1].start(interaction, {}, settings, member);
}

async function setupUser(id, userSettings) {
  let userID = await authUser(id);

  if (userID) {
    await updateUser(userID, userSettings.character, userSettings.timezone, userSettings.baselocation);
    return [];
  } else {
    return await createUser(id,
      userSettings.character,
      userSettings.difficulty,
      userSettings.timezone,
      userSettings.baselocation);
  }
}

function displayProjectInfo(channel) {
  //information about the project
  const infoEmbed = new MessageEmbed()
    .setTitle("Information")
    .setColor(`#${Configurations().primary}`)
    .setDescription(
      `Join the discord server for help,feedback and access to all the latest features and updates: ${Configurations().invite_link}\n
    navigate to the following channels to learn more about the project: \n
    <#968766665305231450> : Check out our frequently asked questions \n
    <#953924789494501376> : Want to contribute? Add a role that suits your interests and help develop this project!  \n
    <#954747309143490591> : Have a look at the roadmap and scope of this project \n
    <#953955545012920370> : You can download the PDF version of the skill tree (and maybe print it out!) here. \n`);
  channel.send({embeds: [infoEmbed]});
}

async function getSettings(client, interaction, userExists, member) {
  let locationID;
  let baseName;
  if (interaction.member == null) {
    locationID = interaction.user.id;
    baseName = "your DMs";
  } else {
    locationID = interaction.guildId;
    const guild = await client.guilds.cache.get(interaction.guildId);
    baseName = `"${guild.name}"`;
  }
  return [
    //Setup start
    new Setting("Initializing Setup Process",
      "Answer the following questions to set up your Skill Tree account",
      new MessageActionRow().addComponents(
        new MessageButton().setCustomId("continue").setLabel("CONTINUE").setStyle("PRIMARY")
      ),
      null,
      (res, userSettings, next) => {
        next();
      }),

    new Setting("Set Experience Level",
      ("Choose one of the following options to optimize Skill Tree to your " +
        "preferred difficulty level \n" +
        "(**Warning**: you cannot change this later, but you can skip/revert skills to suit your needs)\n" +
        "TIP: Remember, ego is the enemy. Start small so you can build consistency\n\n" +
        "**Easy:**\n This is the beginner level (<3 months of self improvement), " +
        "and will start you at Meditation I (2 mins/day) and Journaling I (intro prompts) \n\n" +
        "**Medium:**\n This is the intermediate level (<6 months of self improvement), " +
        "and will start you at Meditation II (5 mins/day), Journalling II (basic prompts), Exercising II (4x/week)\n\n" +
        "**Hard:**\n The most advanced level (around one year and more of self improvement), " +
        "and will start you at Meditation III (10 mins/day), Journalling III (advanced prompts), " +
        "Exercising III (5x/week), Social skills II (basic) and Reading I (10 mins/day),"),
      new MessageActionRow().addComponents(
        new MessageButton().setCustomId("dif_easy").setLabel("Easy").setStyle("PRIMARY"),
        new MessageButton().setCustomId("dif_medium").setLabel("Medium").setStyle("PRIMARY"),
        new MessageButton().setCustomId("dif_hard").setLabel("Hard").setStyle("PRIMARY")
      ),
      null,
      (res, userSettings, next) => {
        userSettings.difficulty = res.toLowerCase();
        next();
      }),

    //Character selection
    new Setting("Choose your Character",
      "Choose the preferred gender of your character " +
      "(Purely aesthetic, this will not affect the skills you have available)",
      new MessageActionRow().addComponents(
        new MessageButton().setCustomId("character_male").setStyle("PRIMARY").setEmoji("🙍🏻‍♂️").setLabel("Male"),
        new MessageButton().setCustomId("character_female").setStyle("PRIMARY").setEmoji("🙍🏻‍♀️").setLabel("Female")
      ),
      null,
      (res, userSettings, next) => {
        userSettings.character = res.toLowerCase();
        next();
      }),

    //Timezone selection
    new Setting("Set your time zone",
      `Your time zone will automatically be set to UTC+0.\n` +
      "Use `/timezone` in a server or in your DMs to change your time zone. \n" +
      "Weekly reviews and reminders will be sent according to this time zone.",
      new MessageActionRow().addComponents(
        new MessageButton().setCustomId("ok").setLabel("OK").setStyle("PRIMARY"),
      ),
      null,
      async (_res, userSettings, next) => {
        const locationInfo = await timezoneFromLocation("GMT+0");
        userSettings.timezone = locationInfo.utcOffset;
        next();
      }),

    //DM options
    new Setting("Set your base location",
      `Your base location has been automatically set to ${baseName}.\n` +
      "Use `~base` in a server or in your DMs to set your base location. \n" +
      "This is where weekly reviews and reminders will be sent automatically.",
      new MessageActionRow().addComponents(
        new MessageButton().setCustomId("ok").setLabel("OK").setStyle("PRIMARY"),
      ),
      null,
      async (res, userSettings, next) => {
        userSettings.baselocation = locationID;
        const items = await setupUser(interaction.user.id, userSettings);

        if (!userExists) {
          const confirmationEmbed = new MessageEmbed()
            .setColor(`#${Configurations().primary}`)
            .setTitle("WELCOME TO THE SKILL TREE")
            .setDescription("To begin your quest, here are a few items you can use!");
          await interaction.editReply({embeds: [confirmationEmbed]});

          createLargeSwipePanel(client, interaction, items);
        }
        next();
      }),

    //Final message
    new Setting(":white_check_mark: Complete",
      "Your Skill Tree account is completely configured! " +
      "check ~guide to understand how you can use skill tree \n Press \"Learn More\"" +
      "to join the discord server and to get information about the project",
      new MessageActionRow().addComponents(
        new MessageButton().setCustomId("complete_learnmore").setStyle("PRIMARY").setLabel("LEARN MORE"),
      ),
      null,
      // eslint-disable-next-line no-unused-vars
      (res, next, userSettings) => {
        if (res === "LEARN MORE") {
          displayProjectInfo(interaction);
        }
      }),
  ];
}

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};

exports.commandData = {
  name: "setup",
  description: "Sets up your Skill Tree account",
  options: [],
  defaultPermission: true,
};
