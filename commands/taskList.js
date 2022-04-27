const {MessageActionRow, MessageSelectMenu, MessageEmbed, MessageButton} = require("discord.js");
const {romanise} = require("../modules/romanNumeralHelper");
const {formatFrequency} = require("../modules/frequencyFormatter.js");
const {updateTask} = require("../modules/APIHelper");
const Skill = require("../objects/skill");
const Task = require("../objects/task");

const tasks = [
  new Skill("reading.png","Reading", 4, "READ 30m", 1, "day", 30, 800),
  new Skill("meditation.png","Meditation", 1, "Meditate for 30m", 3, "day", 30, 2000),
  new Skill("exercise.png","Exercise", 3, "Hit PRs in every exercise", 5, "week", 30, 100)
].map(skill => new Task(0, skill, Math.random() > 0.5));

// Initialize task objects from skill objects.
// The Math.random() > 0.5 part just decides a random value for whether the task has been completed or not,
// as it's just a template for now.

/**
 * Test method to send a template task list - sends an embed containing all the tasks under two categories, DAILY and NO DEADLINE
 * @param client
 * @param message
 * @param args
 * @param level
 */
exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  //let tasksToday = getTasks(message.author.id, new Date());
  //let tasksYesterday = getTasks(message.author.id, new Date(new Date() - 24*60*60*1000));

  const embed = buildEmbed();

  var date = "today";
  const dropDownBox = createDropDownBox(tasks);

  const row = new MessageActionRow()
    .addComponents(
      new MessageButton()
        .setCustomId("yesterday")
        .setLabel("YESTERDAY")
        .setStyle("PRIMARY")
        .setDisabled(false),
      new MessageButton()
        .setCustomId("today")
        .setLabel("TODAY")
        .setStyle("SECONDARY")
        .setDisabled(true));

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

      const embed = buildEmbed(date);
      msg.edit({embeds: [embed], components: [dropDownBox, row]});
    }

    if (i.isSelectMenu()) {
      const skillTitle = i.values[0];
      const task = tasks.find(task => task.skill.title === skillTitle);
      task.completed = !task.completed;

      updateTask(message.author.id, task, date);

      // Send the same embed, but with the updated values of the tasks array.
      const embed = buildEmbed(date);
      const dropDownBox = createDropDownBox(tasks);
      msg.edit({ embeds: [embed], components: [dropDownBox, row] });
    }

    i.deferUpdate();
  });
};

function createDropDownBox() {
  return new MessageActionRow().addComponents(
    new MessageSelectMenu().setCustomId("tasks-selection-box").setPlaceholder("Complete/uncomplete a task").addOptions(
      tasks.map(
        task => {
          return {
            label: `${task.skill.title} ${romanise(task.skill.level)}`,
            description: task.skill.goal,
            value: task.skill.title,
            emoji: task.completed ? "✅" : "❌",
          };
        }
      )
    )
  );
}
// Helper function for building an embed in order to reduce repetition in the code.
function buildEmbed(day) {
  let date = new Date();
  if (day === "yesterday") {
    date = new Date(new Date().getTime() - 24*60*60*1000);
  }
  const month = date.toLocaleString("default", { month: "long" });

  const dateString = `${month} ${date.getDate()}, ${date.getUTCFullYear()}`;

  const dailyTasks = tasks.filter(task => task.skill.interval == "day");
  const otherTasks = tasks.filter(task => task.skill.interval != "day");
  console.log(dailyTasks);
  const dailyTaskStrings = dailyTasks.map((task, idx) => formatTask(task, idx));
  const otherTaskStrings = otherTasks.map((task, idx) => formatTask(task, idx + dailyTaskStrings.length));

  const embed = new MessageEmbed()
    .setTitle(`Tasks for ${dateString}`)
    .setColor("#1071E5")
    .addField("Daily Tasks", dailyTaskStrings.join("\n"))
    .addField("Ongoing", otherTaskStrings.join("\n"));

  return embed;
}

function formatTask(task, idx) {
  const completedEmoji = task.completed ? ":white_check_mark:": ":x:";
  const levelRoman = romanise(task.skill.level);
  const frequencyFormat = formatFrequency(task.skill.frequency, task.skill.interval);

  return `${completedEmoji} | **${idx + 1}. ${task.skill.title} ${levelRoman} (${frequencyFormat})**: ${task.skill.goal}`;
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
