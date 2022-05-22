/* eslint-disable no-case-declarations */
const { MessageEmbed, MessageActionRow, MessageButton} = require("discord.js");
const { createUser, updateUser, auth} = require("../../modules/APIHelper");
const Configurations = require("../../modules/botConfigurations");
const Item = require("../../objects/item");

exports.run = async (client,message) => {
  startSetup(client, message);
};

function setupUser(id, gender, difficulty, dms_enabled) {
  //validates that user does not exist in the database already
  gender = gender.toLowerCase();
  difficulty = difficulty.toLowerCase();
  createUser(id,gender,difficulty,dms_enabled,()=>{ //creates the user
    auth(id,null,(userID)=>{
      updateUser(userID,gender,difficulty);
    });
  });
}

async function startSetup(client, message) {
  //initial embed
  const initEmbed = new MessageEmbed()
    .setTitle("Initializing Setup Process")
    .setDescription("Answer the following questions to set up your Skill Tree account")
    .setColor(`#${Configurations().primary}`)
    .setFooter("Completion Status: \n (1/5)");
  //Difficulty embed
  const difficultyEmbed = new MessageEmbed()
    .setTitle("Set Experience Level")
    .setColor(`#${Configurations().primary}`)
    .setDescription("Choose one of the following options to optimize Skill Tree to your preferred difficulty level (you can change this later by evoking the `setup` command again)")
    .addField("1. Easy", "This is the beginner level (<3 months of self improvement), and will start you at Meditation I, Journalling I and Exercising I")
    .addField("2. Medium", "This is the intermediate level (<6 months of self improvement), and will start you at Meditation II, Journalling II, Exercising II and Social skills I")
    .addField("3. Hard", "The most advanced level (around one year and more of self improvement), and will start you at Meditation III, Journalling III, Exercising III, Social skills II and Reading I")
    .setFooter("Completion Status: \n (2/5) ");
  //enable DMs embed
  const dmEmbed = new MessageEmbed()
    .setTitle("Enable DM Reminders")
    .setColor(`#${Configurations().primary}`)
    .setDescription("Do you want the bot to remind you of tasks to complete in Direct Messages?")
    .setFooter("Completion Status: \n (3/5) ");
  //TODO: get Gender of the player
  const characterEmbed = new MessageEmbed()
    .setTitle("3️Choose your Character")
    .setColor(`#${Configurations().primary}`)
    .setDescription("Choose the preferred gender of your character")
    .setFooter("Completion Status: \n (4/5) ");
  //help and information embed
  const finalEmbed = new MessageEmbed()
    .setTitle(":white_check_mark: Complete")
    .setColor(`#${Configurations().primary}`)
    .setDescription(`Your Skill Tree account is completely configured! check ~guide to understand how you can use skill tree \n Press "Learn More" to join the discord server and to get information about the project 
    `)
    .setFooter("Completion Status: \n (5/5) ");
  //information about the project
  const infoEmbed = new MessageEmbed()
    .setTitle("Information")
    .setColor(`#${Configurations().primary}`)
    .setDescription(`
    Join the discord server for help,feedback and access to all the latest features and updates: ${Configurations().invite_link}\n
    navigate to the following channels to learn more about the project: \n
    <#968766665305231450> : Check out our frequently asked questions \n
    <#953924789494501376> : Want to contribute? Add a role that suits your interests and help develop this project!  \n
    <#954747309143490591> : Have a look at the roadmap and scope of this project \n
    <#953955545012920370> : You can download the PDF version of the skill tree (and maybe print it out!) here. \n`);
  let scope,initMessage,dmMessage,finalMessage,difficultyLevel, enabledDMs,userGender,characterMessage;
  // ORDER: initEmbed -> difficultyEmbed -> DmEmbed -> genderEmbed -> finalEmbed -> infoEmbed
  try {
    if (message.channel.type === "DM") { 
      initMessage = await message.channel.send({embeds: [initEmbed]});
      scope = message.channel;
    }
    else {
      initMessage = await message.member.send({embeds: [initEmbed]});
      scope = message.member;
      const instructions_message = await message.reply(":thumbsup: Message with further instruction has been sent to your DMs!");
      setTimeout(() => instructions_message.delete(),10000);
      message.delete();
    }
  }
  catch (error) {
    // messages in the same channel saying your DMs are disabled
    message.channel.send(`<@${message.member.id}> Your DMs are Disabled. Please enable them and try again`);
    message.channel.send("**HOW TO ENABLE DMS** ```\n\n 1) Right-click server icon \n 2) Click on Privacy Settings \n 3) Toggle \"Allow direct messages from server members on\" \n 4) press Done```");
    return;
  }

  //sends chain message of interaction
  const difficultyRow = new MessageActionRow().addComponents(
    new MessageButton().setCustomId("dif_easy").setLabel("Easy").setStyle("PRIMARY"),
    new MessageButton().setCustomId("dif_medium").setLabel("Medium").setStyle("PRIMARY"),
    new MessageButton().setCustomId("dif_hard").setLabel("Hard").setStyle("PRIMARY")
  );
  const difMessage = await scope.send({embeds: [difficultyEmbed],components: [difficultyRow]});
  const dmRow = new MessageActionRow().addComponents(
    new MessageButton().setCustomId("dm_yes").setLabel("Yes").setStyle("PRIMARY"),
    new MessageButton().setCustomId("dm_no").setLabel("No").setStyle("PRIMARY")
  );
  const finalRow = new MessageActionRow().addComponents(
    new MessageButton().setCustomId("final_button").setLabel("Learn More").setStyle("PRIMARY"),
  );
  const characterRow = new MessageActionRow().addComponents(
    new MessageButton().setCustomId("character_male").setStyle("PRIMARY").setEmoji("🙍🏻‍♂️").setLabel("Male"),
    new MessageButton().setCustomId("character_female").setStyle("PRIMARY").setEmoji("🙍🏻‍♀️").setLabel("Female")
  );
  const collector = difMessage.channel.createMessageComponentCollector({time: 60000});
  collector.on("collect", async i =>{
    const choice = i.component.customId.split("_")[0];
    switch (choice) {
      case "dif":
        initMessage.delete();
        difMessage.delete();
        dmMessage = await scope.send({embeds: [dmEmbed], components: [dmRow]});
        difficultyLevel = i.component.label;
        break;
      case "dm":
        dmMessage.delete();
        enabledDMs = i.component.label === "Yes";
        characterMessage = await scope.send({embeds: [characterEmbed],components: [characterRow]});
        break;
      case "character":
        userGender = i.component.label;
        characterMessage.delete();
        finalMessage = await scope.send({embeds: [finalEmbed],components: [finalRow]});
        scope.send("**TO HELP YOU START WITH YOUR QUEST \nHERE ARE A FEW ITEMS YOU CAN USE. \nWANDER CAUTIOUSLY, BRAVE ADVENTURER!**");
        const book = new Item("SELF IMPROVEMENT GUIDE BOOK", "https://www.youtube.com/watch?v=PYaixyrzDOk", "📙");
        book.send(client, scope);
        const sword = new Item("RUSTY SWORD","", "🗡");
        sword.send(client,scope);
        // we  deal with the given information here 
        setupUser(message.author.id,userGender,difficultyLevel,enabledDMs);
        break;
      case "final":
        scope.send({embeds: [infoEmbed]});
        finalMessage.edit({embeds: [finalEmbed],components:[]});
        break;
    }
  });


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
  description: "sets up user account",
  usage: "setup"
};
