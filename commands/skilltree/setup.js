/* eslint-disable no-case-declarations */
const { MessageEmbed, MessageActionRow, MessageButton} = require("discord.js");
const { createUser, updateUser, authUser} = require("../../modules/userAPIHelper");
const Configurations = require("../../modules/botConfigurations");
const Item = require("../../objects/item");
const {timezoneFromLocation} = require("../../modules/timezoneHelper");
const {locationConfirmation} = require("./timezone");
const Setting = require("../../objects/setting");

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
  try {
    let scope;
    if (message.channel.type === "DM") {
      scope = message.channel;
    } else {
      scope = message.member;
      //Send warning to user
      const instructions_message = await message.reply(":thumbsup: Message with further instruction has been sent to your DMs!");
      setTimeout(() => instructions_message.delete(),10000);
      message.delete();
    }
    startSetup(message, scope);
  }
  catch (error) {
    // messages in the same channel saying your DMs are disabled
    const errorMsg = await message.channel.send(
      "<@${message.member.id}> Your DMs are Disabled. Please enable them and try again" +
      "(You can turn this setting off afterwards, we need to do this to prevent spam)" +
      "**HOW TO ENABLE DMS**```" +
      "1) Right-click server icon\n" +
      "2) Click on Privacy Settings\n" +
      "3) Toggle \"Allow direct messages from server members\" on\n" +
      "4) press Done```");
    setTimeout(() => errorMsg.delete(),10000);
  }
};
function startSetup(message, scope) {
  //Validate user exists
  authUser(message.author.id, message.channel, (userID) => {
    if (userID) {
      //Start the setup
      let settings = getSettings(scope, message, true);
      settings = settings.filter(s => s.title !== "Set Experience Level");
      settings[0].start(null, scope, {}, settings);
    } else {
      //Start the setup
      const settings = getSettings(scope, message, false);
      settings[0].start(null, scope, {}, settings);
    }
  });
}

function setupUser(id, out) {
  out.character.toLowerCase();
  out.difficulty.toLowerCase();
  authUser(id,null,(userID) => {
    if (userID) {
      updateUser(userID, out.character, out.difficulty, out.dms_enabled, out.timezone);
    } else {
      createUser(id, out.character, out.difficulty, out.dms_enabled, out.timezone);
    }
  });
}

function displayProjectInfo(channel) {
  //information about the project
  const infoEmbed = new MessageEmbed()
    .setTitle("Information")
    .setDescription(
      `Join the discord server for help,feedback and access to all the latest features and updates: ${Configurations().invite_link}\n
    navigate to the following channels to learn more about the project: \n
    <#968766665305231450> : Check out our frequently asked questions \n
    <#953924789494501376> : Want to contribute? Add a role that suits your interests and help develop this project!  \n
    <#954747309143490591> : Have a look at the roadmap and scope of this project \n
    <#953955545012920370> : You can download the PDF version of the skill tree (and maybe print it out!) here. \n`);
  channel.send({embeds: [infoEmbed]});
}

function getSettings(channel, message, userExists) {
  return [
    //Setup start
    new Setting("Initializing Setup Process",
      "Answer the following questions to set up your Skill Tree account",
      new MessageActionRow().addComponents(
        new MessageButton().setCustomId("continue").setLabel("CONTINUE").setStyle("PRIMARY")
      ),
      null,
      (res, out, next)=>{
        next();
      }),

    new Setting("Set Experience Level",
      ("Choose one of the following options to optimize Skill Tree to your " +
      "preferred difficulty level \n" +
      "(**Warning**: you cannot change this later, but you can skip/revert skills to suit your needs)\n\n" +
      "**1. Easy:**\n This is the beginner level (<3 months of self improvement), " +
      "and will start you at the beginning of the tree\n" +
      "**2. Medium:**\n This is the intermediate level (<6 months of self improvement), "+
      "and will start you at Meditation II, Journalling II, Exercising II\n" +
      "**3. Hard:**\n The most advanced level (around one year and more of self improvement), "+
      "and will start you at Meditation III, Journalling III, Exercising III, Social skills II and Reading I,"),
      new MessageActionRow().addComponents(
        new MessageButton().setCustomId("dif_easy").setLabel("Easy").setStyle("PRIMARY"),
        new MessageButton().setCustomId("dif_medium").setLabel("Medium").setStyle("PRIMARY"),
        new MessageButton().setCustomId("dif_hard").setLabel("Hard").setStyle("PRIMARY")
      ),
      null,
      (res, out, next)=>{
        out.difficulty = res;
        next();
      }),

    //DM options
    new Setting("Enable DM Reminders",
      "Do you want the bot to remind you of tasks to complete in Direct Messages?",
      new MessageActionRow().addComponents(
        new MessageButton().setCustomId("dm_yes").setLabel("Yes").setStyle("PRIMARY"),
        new MessageButton().setCustomId("dm_no").setLabel("No").setStyle("PRIMARY")
      ),
      null,
      (res, out, next) => {
        out.dms_enabled = res === "Yes";
        next();
      }),

    //Character selection
    new Setting("Choose your Character",
      "Choose the preferred gender of your character" +
      "(Purely aesthetic, this will not affect the skills you have available)",
      new MessageActionRow().addComponents(
        new MessageButton().setCustomId("character_male").setStyle("PRIMARY").setEmoji("🙍🏻‍♂️").setLabel("Male"),
        new MessageButton().setCustomId("character_female").setStyle("PRIMARY").setEmoji("🙍🏻‍♀️").setLabel("Female")
      ),
      null,
      (res, out, next) => {
        out.character = res;
        next();
      }),

    //Timezone selection
    new Setting("Specify your timezone",
      "Write your timezone in the format:\n" +
      "<timezone> or <location> or <timecode> (e.g EST / london / GMT+5)\n"+
      "(Warning: you must complete this within 60 seconds, otherwise you will need to restart the setup process)",
      null,
      (thismessage, complete, next, out)=>{
        //Filter and parse location messages
        const filter = (m) => m.author.id === message.author.id;
        const timezoneCollector = thismessage.channel.createMessageCollector({filter, time: 60000});
        timezoneCollector.on("collect", async (msg) => {

          if (msg.author.id !== message.author.id) return;
          const locationInfo = await timezoneFromLocation(msg.content);

          locationConfirmation(message, locationInfo, async (locationInfo) => {
            timezoneCollector.stop();
            complete(locationInfo.utcOffset, out, next);
          });
        });
        // fires when the collector is finished collecting
        timezoneCollector.on("end", (collected, reason) => {
          if (reason === "time") {
            message.channel.send("The timezone selector has timed out. Please restart the setup process");
          }
        });
      },
      (res, out, next)=>{
        out.timezone = res;

        if (!userExists) {
          //final result
          channel.send("**TO HELP YOU START WITH YOUR QUEST \n" +
            "HERE ARE A FEW ITEMS YOU CAN USE. \n" +
            "WANDER CAUTIOUSLY, BRAVE ADVENTURER!**");
          const book = new Item(-1, "SELF IMPROVEMENT GUIDE BOOK", "https://www.youtube.com/watch?v=PYaixyrzDOk", "📙");
          book.send(channel);
          const sword = new Item(-1, "RUSTY SWORD", "", "🗡");
          sword.send(channel);
          setupUser(message.author.id, out);
        }

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
      (res, next, out)=> {
        if (res === "LEARN MORE") {
          displayProjectInfo(channel);
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
