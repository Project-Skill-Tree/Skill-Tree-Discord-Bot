const Skill = require("../objects/skill.js");
const Task = require("../objects/task.js");
const {MessageActionRow, MessageSelectMenu,MessageEmbed} = require("discord.js");
const romanise = require("../modules/romanNumeralHelper");
const formatFrequency = require("../modules/frequencyFormatter.js");

// Initialize task objects from skill objects.
// The Math.random() > 0.5 part just decides a random value for whether the task has been completed or not,
// as it's just a template for now.
const tasks = [
  new Skill("reading.png","Reading", 4, "READ 30m", "day", 30, 1, 800),
  new Skill("meditation.png","Meditation", 1, "Meditate for 30m", "day", 30, 3 ,2000),
  new Skill("exercise.png","Exercise", 3, "Hit PRs in every exercise", "week", 30, 5, 100)
].map(skill => new Task(skill, Math.random() > 0.5));

/**
 * Test method to send a template task list - sends an embed containing all the tasks under two categories, DAILY and NO DEADLINE
 * @param client
 * @param message
 * @param args
 * @param level
 */
exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  const embed = buildEmbed();

  const dropDownBox = createDropDownBox(tasks);

  const msg = await message.channel.send({ embeds: [embed], components: [dropDownBox] });
  const collector = msg.createMessageComponentCollector({ time: 30000 });

  collector.on("collect", i => {
    if (i.user.id !== message.author.id) {
      i.reply({ content: "You can't edit someone else's task list!", ephemeral: true });
      return;
    }

    const skillTitle = i.values[0];
    const task = tasks.find(task => task.skill.title === skillTitle);
    task.completed = !task.completed;

    // Send the same embed, but with the updated values of the tasks array.
    const embed = buildEmbed();
    const dropDownBox = createDropDownBox(tasks);

    msg.edit({ embeds: [embed], components: [dropDownBox] });

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
function buildEmbed() {
  const date = new Date();
  const month = date.toLocaleString("default", { month: "long" }); 

  const dateString = `${month} ${date.getDate()}, ${date.getUTCFullYear()}`;

  const dailyTasks = tasks.filter(task => task.skill.interval == "day");
  const otherTasks = tasks.filter(task => task.skill.interval != "day");

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
