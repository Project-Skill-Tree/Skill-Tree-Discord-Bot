/* eslint-disable no-case-declarations */
const { MessageEmbed, MessageActionRow, MessageButton} = require("discord.js");
const { createUser, updateUser, authUser} = require("../../modules/userAPIHelper");
const Configurations = require("../../modules/botConfigurations");
const Item = require("../../objects/item");
const {timezoneFromLocation} = require("../../modules/timezoneHelper");
const {locationConfirmation} = require("./timezone");
const Setting = require("../../objects/setting");
const Unlocked = require("../../objects/unlocked");

/**
 * Setup user account
 * Page 1. Info page
 * Page 2. Set experience level (beginner/intermeditae/expert)
 * Page 3. DM reminders
 * Page 4. Choose your character (male/female)
 * Page 5. Select your timezone
 * Page 6. Complete confirmation
 */
exports.run = async (client,message) => {
  let scope;
  let instructions_message;
  if (message.channel.type === "DM") {
    scope = message.channel;
  } else {
    scope = message.member;
    //Send notification reply to user
    instructions_message = await message.reply(":thumbsup: Message with further instruction has been sent to your DMs!");
    setTimeout(() => instructions_message.delete(),10000);
    message.delete();
  }
  //Send init message to check chat is available
  const init = getSettings(scope, message, false)[0];
  init.sendInitMessage(message, scope, ()=>{
    if (instructions_message) instructions_message.delete();
  },
  (initMessage)=>{
    startSetup(initMessage, message, scope);
  });
};

function startSetup(initMessage, message, scope) {
  //Validate user exists
  authUser(message.author.id,null, (userID) => {
    if (userID) {
      //Start the setup
      let settings = getSettings(scope, message, true);
      settings = settings.filter(s => s.title !== "Set Experience Level");
      settings[1].start(initMessage, scope, {}, settings);
    } else {
      //Start the setup
      const settings = getSettings(scope, message, false);
      settings[1].start(initMessage, scope, {}, settings);
    }
  });
}

function setupUser(id, userSettings) {
  authUser(id,null,(userID) => {
    if (userID) {
      updateUser(userID, userSettings.character, userSettings.timezone, userSettings.baselocation);
    } else {
      createUser(id, userSettings.character, userSettings.difficulty, userSettings.timezone, userSettings.baselocation);
    }
  });
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

function getSettings(scope, message, userExists) {
  let locationID;
  if (message.channel.type === "DM") {
    locationID = message.author.id;
  } else {
    locationID = message.guild.id;
  }
  let baseName;
  if (message.channel.type === "DM") {
    baseName = "your DMs";
  } else {
    baseName = `"${message.guild.name}"`;
  }
  return [
    //Setup start
    new Setting("Initializing Setup Process",
      "Answer the following questions to set up your Skill Tree account",
      new MessageActionRow().addComponents(
        new MessageButton().setCustomId("continue").setLabel("CONTINUE").setStyle("PRIMARY")
      ),
      null,
      (res, userSettings, next)=>{
        next();
      }),

    new Setting("Set Experience Level",
      ("Choose one of the following options to optimize Skill Tree to your " +
      "preferred difficulty level \n" +
      "(**Warning**: you cannot change this later, but you can skip/revert skills to suit your needs)\n" +
      "TIP: Remember, ego is the enemy. Start small so you can build consistency\n\n"+
      "**Easy:**\n This is the beginner level (<3 months of self improvement), " +
      "and will start you at Meditation I (2 mins/day) and Journaling I (intro prompts) \n\n" +
      "**Medium:**\n This is the intermediate level (<6 months of self improvement), "+
      "and will start you at Meditation II (5 mins/day), Journalling II (basic prompts), Exercising II (4x/week)\n\n" +
      "**Hard:**\n The most advanced level (around one year and more of self improvement), "+
      "and will start you at Meditation III (10 mins/day), Journalling III (advanced prompts), " +
      "Exercising III (5x/week), Social skills II (basic) and Reading I (10 mins/day),"),
      new MessageActionRow().addComponents(
        new MessageButton().setCustomId("dif_easy").setLabel("Easy").setStyle("PRIMARY"),
        new MessageButton().setCustomId("dif_medium").setLabel("Medium").setStyle("PRIMARY"),
        new MessageButton().setCustomId("dif_hard").setLabel("Hard").setStyle("PRIMARY")
      ),
      null,
      (res, userSettings, next)=>{
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
    new Setting("Specify your timezone",
      "Write your timezone in the format:\n" +
      "<timezone> or <location> or <timecode> (e.g EST / london / GMT+5)\n"+
      "(Warning: you must complete this within 60 seconds, otherwise you will need to restart the setup process)",
      null,
      (thismessage, complete, next, userSettings)=>{
        //Filter and parse location messages
        const filter = (m) => m.author.id === message.author.id;
        const timezoneCollector = thismessage.channel.createMessageCollector({filter, time: 60000});
        timezoneCollector.on("collect", async (msg) => {

          if (msg.author.id !== message.author.id) return;
          const locationInfo = await timezoneFromLocation(msg.content);

          locationConfirmation(msg, scope, locationInfo, async (locationInfo) => {
            timezoneCollector.stop();
            userSettings.timezone = locationInfo.utcOffset;
            complete("OK", userSettings, next);
          });
        });
        // fires when the collector is finished collecting
        timezoneCollector.on("end", (collected, reason) => {
          if (reason === "time") {
            scope
              .send("The timezone selector has timed out. Please restart the setup process")
              .then(msg => {
                setTimeout(() => msg.delete(), 10000);
              });
            timezoneCollector.stop();
          }
        });
      },
      (res, userSettings, next)=>{
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
      (res, userSettings, next) => {
        userSettings.baselocation = locationID;

        if (!userExists) {
          const confirmationEmbed = new MessageEmbed()
            .setColor(`#${Configurations().primary}`)
            .setTitle("WELCOME TO THE SKILL TREE")
            .setDescription("To begin your quest, here are a few items you can use!");
          scope.send({embeds: [confirmationEmbed]});

          const book = new Unlocked(new Item(-1, "SELF IMPROVEMENT GUIDE BOOK", "" +
            "https://www.youtube.com/watch?v=PYaixyrzDOk", "📙"));
          book.send(null, scope);
          const sword = new Unlocked(new Item(-1, "RUSTY SWORD", "", "🗡"));
          sword.send(null, scope);
        }
        setupUser(message.author.id, userSettings);
        next();
      }),

    //Final message
    new Setting(":white_check_mark: Complete",
      "Your Skill Tree account is completely configured! "+
        "check ~guide to understand how you can use skill tree \n Press \"Learn More\"" +
        "to join the discord server and to get information about the project",
      new MessageActionRow().addComponents(
        new MessageButton().setCustomId("complete_learnmore").setStyle("PRIMARY").setLabel("LEARN MORE"),
      ),
      null,
      // eslint-disable-next-line no-unused-vars
      (res, next, userSettings)=> {
        if (res === "LEARN MORE") {
          displayProjectInfo(scope);
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

exports.help = {
  name: "setup",
  category: "Skill Tree",
  description: "Sets up user account",
  usage: "setup"
};
