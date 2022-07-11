const {MessageActionRow, MessageSelectMenu, MessageEmbed, MessageButton} = require("discord.js");
const {romanise} = require("../../modules/romanNumeralHelper");
const {updateTask, getCurrentTasks} = require("../../modules/skillAPIHelper");
const {dayToDate, getAbsDate, getDaysBetweenDates, formatFrequency} = require("../../modules/dateHelper");
const {createLargeSwipePanel} = require("../../modules/menuHelper");
const {displayLevelUp} = require("../../modules/profileRenderer");
const {authUser, getUser} = require("../../modules/userAPIHelper");
const Challenge = require("../../objects/challenge");
const Skill = require("../../objects/skill");

/**
 * Sends an embed containing all the tasks under two categories, DAILY and ONGOING
 */
exports.run = async (client, message) => {
  //Validate user exists
  authUser(message.author.id, message.channel, (userID) => {
    //Get tasks
    getCurrentTasks(userID,(tasks, timezoneOffset)=>{
      if (tasks.length === 0) {
        message.channel
          .send("```No Current tasks, go to `~start` to start a skill```")
          .then(msg => {
            setTimeout(() => msg.delete(), 10000);
          });
      } else {
        //Show tasks in embed
        createTaskList(client, message, tasks, userID, timezoneOffset);
      }
    });
  });
};

/**
 * Create task list
 * Has yesterday/today button to toggle previous day
 * Has combobox to select which skill has been completed
 * @param client
 * @param message
 * @param tasks
 * @param userID
 * @param timezoneOffset
 * @return {Promise<void>}
 */
async function createTaskList(client, message, tasks, userID, timezoneOffset) {
  const UTC = new Date(Date.parse(new Date().toUTCString()));
  const dayCreated = new Date(UTC.getTime() + timezoneOffset*3600000);
  let day = "today";
  let date = dayToDate(day, timezoneOffset);

  const embed = buildEmbed(tasks, date, timezoneOffset);
  const dropDownBox = createDropDownBox(tasks, date, timezoneOffset);

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
  const msg = await message.reply({ embeds: [embed], components: [dropDownBox,row] });

  const collector = msg.createMessageComponentCollector({time: 240000});

  collector.on("collect", i => {
    if (i.user.id !== message.author.id) {
      i.reply({ content: "You can't edit someone else's task list!", ephemeral: true });
      return;
    }
    if (getDaysBetweenDates(dayCreated,
      new Date(new Date().getTime() + timezoneOffset*3600000), timezoneOffset) !== 0) {
      i.reply({ content: "This task list is outdated, run the command again to get today's tasks", ephemeral: true });
      return;
    }

    if (i.isButton()) {
      day = i.customId; //today or yesterday
      date = dayToDate(day, timezoneOffset);
      if (i.customId === "today") {
        row.components[0].setStyle("PRIMARY").setDisabled(false);
        row.components[1].setStyle("SECONDARY").setDisabled(true);
      } else if (i.customId === "yesterday") {
        row.components[0].setStyle("SECONDARY").setDisabled(true);
        row.components[1].setStyle("PRIMARY").setDisabled(false);
      }
    }


    const filteredTasks = tasks.filter(task => {
      return getAbsDate(date) >= getAbsDate(task.startDate);
    });

    if (i.isSelectMenu()) {
      const skillTitle = i.values[0];
      const task = filteredTasks.find(task => task.child.getName() === skillTitle);
      if (!task) return;
      task.setChecked(!task.isChecked(date, timezoneOffset), date, timezoneOffset);

      updateTask(userID, task, day, task.isChecked(date, timezoneOffset), (levelUp, unlocked) => {
        if (levelUp !== 0) {
          getUser(userID, message.author.username, (user) => {
            displayLevelUp(user, message.channel);
          });
        }
        if (unlocked.length !== 0) {
          createLargeSwipePanel(client, message, unlocked);
        }
      });
    }

    // Send the same embed, but with the updated values of the tasks array.
    const embed = buildEmbed(filteredTasks, date, timezoneOffset);
    const dropDownBox = createDropDownBox(filteredTasks, date);
    const components = [];
    if (dropDownBox != null) {
      components.push(dropDownBox);
    }
    components.push(row);
    msg.edit({ embeds: [embed], components: components});

    i.deferUpdate();
  });
}

function createDropDownBox(tasks, date, timezoneOffset) {
  if (tasks.length !== 0) {
    return new MessageActionRow().addComponents(
      new MessageSelectMenu().setCustomId("tasks-selection-box").setPlaceholder("Check/uncheck a task").addOptions(
        tasks.map(
          task => {
            let goal = task.child.goal;
            if (!goal) {
              return {
                label: task.child.getName(),
                description: task.child.goals,
                value: task.child.getName(),
                emoji: task.isChecked(date, timezoneOffset) ? "✅" : "❌",
              };
            }
            if (goal.length > 100) {
              goal = task.child.goal.substring(0,97) + "...";
            }
            return {
              label: task.child.getName(),
              description: goal,
              value: task.child.getName(),
              emoji: task.isChecked(date, timezoneOffset) ? "✅" : "❌",
            };
          }
        )
      )
    );
  }
  return null;
}

// Helper function for building an embed in order to reduce repetition in the code.
function buildEmbed(tasks, date, tz) {
  const month = date.toLocaleString("default", { month: "long" });

  const dateString = `${month} ${date.getDate()}, ${date.getUTCFullYear()}`;
  const challengeTasks = tasks.filter(task => task.child instanceof Challenge);
  const dailyTasks = tasks.filter(task => task.child instanceof Skill && task.child.interval === "day");
  const otherTasks = tasks.filter(task => task.child instanceof Skill && task.child.interval !== "day");

  let dailyTaskStrings = dailyTasks.map((task) => formatTask(task, date, tz)).join("\n");
  let otherTaskStrings = otherTasks.map((task) => formatTask(task, date, tz)).join("\n");
  let challengeTaskStrings = challengeTasks.map((task) => formatTask(task, date, tz)).join("\n");

  if (dailyTaskStrings.length === 0) { dailyTaskStrings = "No daily tasks are available";}
  if (otherTaskStrings.length === 0) { otherTaskStrings = "No other tasks are available";}
  if (challengeTaskStrings.length === 0) { challengeTaskStrings = "No challenges available";}
  const messageEmbed = new MessageEmbed()
    .setTitle(`Tasks for ${dateString}`)
    .setColor("#1071E5");
  addField(messageEmbed, dailyTaskStrings, "DAILY TASKS");
  addField(messageEmbed, otherTaskStrings, "OTHER");
  addField(messageEmbed, challengeTaskStrings, "CHALLENGES");
  return messageEmbed;
}

function addField(messageEmbed, string, title) {
  //Chop tasks to fit field
  let chopped = string;
  let index = 0;
  while (chopped.length !== 0) {
    const chars = chopped.slice(0, 1024);
    const name = index === 0 ? title : title + " (cont)";

    if (chars.length < 1024) {
      messageEmbed.addField(name, chars);
      chopped = "";
    } else {
      const lastSplit = chars.lastIndexOf("\n");
      const field = chars.slice(0, lastSplit);
      chopped = chopped.slice(lastSplit + 1);
      messageEmbed.addField(name, field);
    }
    index += 1;
  }
}

function formatTask(task, date, tz) {
  if (task.child instanceof Challenge) {
    const checkedEmoji = task.isChecked(date, tz) ? ":white_check_mark:": ":x:";
    return `${checkedEmoji} | **${task.child.title} (INCOMPLETE)**: \n${task.child.goal}`;
  }
  if (task.child instanceof Skill) {
    const checkedEmoji = task.isChecked(date, tz) ? ":white_check_mark:" : ":x:";
    const levelRoman = romanise(task.child.level);

    const freq = formatFrequency(task.child.frequency, task.child.interval);
    if (freq === "DAILY") {
      return `${checkedEmoji} | **${task.child.title} ${levelRoman} (${task.percentChecked(date, tz)})**: \n${task.child.goal}`;
    } else {
      if (task.child.timelimit === "N/A") {
        return `${checkedEmoji} | **${task.child.title} ${levelRoman} (0/1)**: \n${task.child.goal}`;
      } else {
        const numForPeriod = task.numCheckedInInterval(date, tz);
        const daysLeft = task.daysLeftInterval(date, tz);
        return `${checkedEmoji} | **${task.child.title} ${levelRoman} (${freq} - ${numForPeriod} - ${daysLeft})**: \n${task.child.goal}`;
      }
    }
  }
  return "";
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
