const Skill = require("../objects/skill.js");
const Task = require("../objects/task.js");
const { MessageEmbed } = require("discord.js");
const romanise = require("../modules/romanNumeralHelper");

// Initialize task objects from skill objects.
// The Math.random() > 0.5 part just decides a random value for whether the task has been completed or not, 
// as it's just a template for now.
const tasks = [ //eslint-disable-line no-unused-vars
  new Skill("reading.png","Reading", 4, "READ 30m", "DAILY", "x1 MONTH", 800),
  new Skill("meditation.png","Meditation", 1, "Meditate for 30m", "DAILY", "x1 MONTH", 2000),
  new Skill("exercise.png","Exercise", 3, "Hit PRs in every exercise", "N/A", "x1 MONTH", 100)
].map(skill => new Task(skill, Math.random() > 0.5));

/**
 * Test method to send a template task list
 * @param client
 * @param message
 * @param args
 * @param level
 */
exports.run = (client, message, args, level) => { // eslint-disable-line no-unused-vars
  switch (args[0]) {
    case "daily": {
      const embed = new MessageEmbed().setTitle("Tasks for today").setColor("#1071E5");
      const dailyTasks = tasks.filter(task => task.skill.time == "DAILY");

      embed.setFields(dailyTasks.map(task => {
        let completed_emoji;

        if (task.completed) {
          completed_emoji = ":white_check_mark:";
        } else {
          completed_emoji = ":x:";
        }

        const level = romanise(task.skill.level);

        return {
          name: `${completed_emoji} ${task.skill.title} ${level}`,
          value: `${task.skill.goal}`,
        };
      }));

      message.channel.send({ embeds: [embed] });
      break;
    }

    case "other": {
      const embed = new MessageEmbed().setTitle("Other tasks").setColor("#1071E5");
      const dailyTasks = tasks.filter(task => task.skill.time == "N/A");

      embed.setFields(dailyTasks.map(task => {
        let completed_emoji;

        if (task.completed) {
          completed_emoji = ":white_check_mark:";
        } else {
          completed_emoji = ":x:";
        }

        const level = romanise(task.skill.level);

        return {
          name: `${completed_emoji} ${task.skill.title} ${level}`,
          value: `${task.skill.goal}`,
        };
      }));

      message.channel.send({ embeds: [embed] });
      break;
    }

    default: {
      const date = new Date();
      const month = date.toLocaleString("default", { month: "long" }); 
      const dateString = `${month}, ${date.getDate()}, ${date.getUTCFullYear()}`;

      const dailyTasks = tasks.filter(task => task.skill.time == "DAILY");
      const completedDailyTasks = dailyTasks.filter(task => task.completed).length;

      const otherTasks = tasks.filter(task => task.skill.time == "N/A");
      const completedOtherTasks = otherTasks.filter(task => task.completed).length;

      const embed = new MessageEmbed()
        .setTitle(`Tasks for ${dateString}`)
        .setColor("#1071E5")
        .addField("Daily tasks | `~tasks daily`", `${completedDailyTasks}/${dailyTasks.length} tasks completed`, false)
        .addField("No deadline | `~tasks other`", `${completedOtherTasks}/${otherTasks.length} tasks completed`, false);

      message.channel.send({ embeds: [embed] });
      break;
    }
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "tasks",
  category: "Miscellaneous",
  description: "Tests daily task list",
  usage: "tasks"
};
