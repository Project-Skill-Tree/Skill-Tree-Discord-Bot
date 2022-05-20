const {MessageActionRow, MessageSelectMenu, MessageEmbed, MessageButton} = require("discord.js");
const {romanise} = require("../../modules/romanNumeralHelper");
const {formatFrequency} = require("../../modules/frequencyFormatter.js");
const {updateTask, auth} = require("../../modules/APIHelper");
const {getSkillsInProgress} = require("../../modules/APIHelper");



/**
 * Test method to send a template task list - sends an embed containing all the tasks under two categories, DAILY and NO DEADLINE
 * @param client
 * @param message
 * @param args
 * @param level
 */
exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  //gets tasks and makes it a global variable
  auth(message.author.id, message.channel, (userID) => {
    getSkillsInProgress(userID,(list)=>{
      taskListCommand(client,message,list);
    }
    );
  });
  //Validate user exists

};

async function taskListCommand(client, message,tasks) {
  //let tasksToday = getTasks(message.author.id, new Date());
  //let tasksYesterday = getTasks(message.author.id, new Date(new Date() - 24*60*60*1000));

  var date = "today";
  const embed = buildEmbed(date,tasks);
  const dropDownBox = createDropDownBox(tasks);

  const row = new MessageActionRow()
    .addComponents(
      new MessageButton()
        .setCustomId("yesterday")
        .setLabel("YESTERDAY")
        .setStyle("PRIMARY")
        .setDisabled(true),
      new MessageButton()
        .setCustomId("today")
        .setLabel("TODAY")
        .setStyle("SECONDARY")
        .setDisabled(false));

  const msg = await message.channel.send({ embeds: [embed], components: [dropDownBox, row] });

  const collector = msg.createMessageComponentCollector({time: 30000 });

  collector.on("collect", i => {
    if (i.user.id !== message.author.id) {
      i.reply({ content: "You can't edit someone else's task list!", ephemeral: true });
      return;
    }

    if (i.isButton()) {
      if (i.customId === "today") {
        date = "today";
        row.components[0].setStyle("PRIMARY").setDisabled(false);
        row.components[1].setStyle("SECONDARY").setDisabled(true);
      } else if (i.customId === "yesterday") {
        date = "yesterday";
        row.components[0].setStyle("SECONDARY").setDisabled(true);
        row.components[1].setStyle("PRIMARY").setDisabled(false);
      }

      const embed = buildEmbed(date,tasks);
      msg.edit({embeds: [embed], components: [dropDownBox, row]});
    }

    if (i.isSelectMenu()) {
      const skillTitle = i.values[0];
      const task = tasks.find(task => task.skill.title === skillTitle);
      task.completed = !task.completed;
      auth(message.author.id, message.channel, (userID) => {
        updateTask(userID, task, date);
      });

      // Send the same embed, but with the updated values of the tasks array.
      const embed = buildEmbed(date,tasks);
      const dropDownBox = createDropDownBox(tasks);
      msg.edit({ embeds: [embed], components: [dropDownBox, row] });
    }

    i.deferUpdate();
  });
}

function createDropDownBox(tasks) {
  return new MessageActionRow().addComponents(
    new MessageSelectMenu().setCustomId("tasks-selection-box").setPlaceholder("Complete/uncomplete a task").addOptions(
      tasks.map(
        task => {
          return {
            label: `${task.title} ${romanise(task.level)}`,
            description: task.goal,
            value: task.title,
            emoji: task.completed ? "✅" : "❌",
          };
        }
      )
    )
  );
}
// Helper function for building an embed in order to reduce repetition in the code.
function buildEmbed(day,tasks) {
  
  let date = new Date();
  if (day === "yesterday") {
    date = new Date(new Date().getTime() - 24*60*60*1000);
  }
  const month = date.toLocaleString("default", { month: "long" });

  const dateString = `${month} ${date.getDate()}, ${date.getUTCFullYear()}`;
  const dailyTasks = tasks.filter(task => task.interval === "day");
  const otherTasks = tasks.filter(task => task.interval != "day");
  let dailyTaskStrings = dailyTasks.map((task, idx) => formatTask(task, idx)).join("\n"); 
  let otherTaskStrings = otherTasks.map((task, idx) => formatTask(task, idx + dailyTaskStrings.length)).join("\n");
  if (dailyTaskStrings.length === 0) { dailyTaskStrings = "No daily tasks are available";}
  if (otherTaskStrings.length === 0) { otherTaskStrings = "No other tasks are available";}
  const embed = new MessageEmbed()
    .setTitle(`Tasks for ${dateString}`)
    .setColor("#1071E5")
    .addField("Daily Tasks", dailyTaskStrings)
    .addField("Ongoing", otherTaskStrings);

  return embed;
}

function formatTask(task, idx) {
  const completedEmoji = task.completed ? ":white_check_mark:": ":x:";
  const levelRoman = romanise(task.level);
  const frequencyFormat = formatFrequency(task.frequency, task.interval);

  return `${completedEmoji} | **${idx + 1}. ${task.title} ${levelRoman} (${frequencyFormat})**: ${task.goal}`;
}

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "tasks",
  category: "Skill Tree",
  description: "daily task list",
  usage: "tasks"
};
