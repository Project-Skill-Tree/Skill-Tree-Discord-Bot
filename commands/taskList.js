const Skill = require("../objects/skill.js");
const Task = require("../objects/task.js");

// Initialize task objects from skill objects.
// The Math.random() > 0.5 part just decides a random value for whether the task has been completed or not, 
// as it's just a template for now.
const tasks = [ //eslint-disable-line no-unused-vars
  new Skill("reading.png","READING", 4, "READ 30m", "DAILY", "x1 MONTH", 800),
  new Skill("meditation.png","MEDITATION", 1, "Meditate for 30m", "DAILY", "x1 MONTH", 2000),
  new Skill("exercise.png","EXERCISE", 3, "Hit PRs in every exercise", "N/A", "x1 MONTH", 100)
].map(skill => new Task(skill, Math.random() > 0.5));

/**
 * Test method to send a template task list
 * @param client
 * @param message
 * @param args
 * @param level
 */
exports.run = (client, message, args, level) => { // eslint-disable-line no-unused-vars
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
