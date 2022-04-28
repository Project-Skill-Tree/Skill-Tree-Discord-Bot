const { MessageEmbed, MessageActionRow, MessageButton} = require("discord.js");
const Configurations = require("../modules/botConfigurations");

exports.run = async (client,message) => {
  //initial embed
  const initEmbed = new MessageEmbed()
    .setTitle(":white_check_mark: Initializing Setup Process")
    .setDescription("Answer the following questions to set up your Skill Tree account")
    .setColor(`#${Configurations().primary}`)
    .setFooter("Completion Status: \n (1/4)");
  //Difficulty embed
  const difficultyEmbed = new MessageEmbed()
    .setTitle(":one: Set Experience Level")
    .setColor(`#${Configurations().primary}`)
    .setDescription("Choose one of the following options to optimize Skill Tree to your preferred difficulty level (you can change this later by evoking the `setup` command again)")
    .addField("1. Easy", "This is the beginner level (<3 months of self improvement), and will start you at Meditation I, Journalling I and Exercising I")
    .addField("2. Medium", "This is the intermediate level (<6 months of self improvement), and will start you at Meditation II, Journalling II, Exercising II and Social skills I")
    .addField("3. Hard", "The most advanced level (around one year and more of self improvement), and will start you at Meditation III, Journalling III, Exercising III, Social skills II and Reading I")
    .setFooter("Completion Status: \n (2/4) ");
  //enable DMs embed
  const dmEmbed = new MessageEmbed()
    .setTitle(":two: Enable DM Reminders")
    .setColor(`#${Configurations().primary}`)
    .setDescription("Do you want the bot to remind you of tasks to complete in Direct Messages?")
    .setFooter("Completion Status: \n (3/4) "); 
  //help and information embed
  const finalEmbed = new MessageEmbed()
    .setTitle(":white_check_mark: Complete")
    .setColor(`#${Configurations().primary}`)
    .setDescription(`Your Skill Tree account is completely configured! envoke ~help to see all the commands you can use! \n also, navigate to the following channels to learn more about the project: \n
    <#968766665305231450> : Check out our frequently asked questions \n
    <#953924789494501376> : Want to contribute? Add a role that suits your interests and help develop this project!  \n
    <#954747309143490591> : Have a look at the roadmap and scope of this project \n
    <#953955545012920370> : You can download the PDF version of the skill tree (and maybe print it out!) here. \n
    `)
    .setFooter("Completion Status: \n (4/4) ");

  let scope,initMessage,dmMessage,finalMessage,difficultyLevel, enabledDMs;
  // ORDER: initEmbed -> difficultyEmbed -> DmEmbed -> finalEmbed
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
        enabledDMs = i.component.label;
        finalMessage = await scope.send({embeds: [finalEmbed]});
        scope.send(`Join the discord server for help,feedback and access to all the latest features and updates: ${Configurations().invite_link}`);
        break;
    }
  });

};

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