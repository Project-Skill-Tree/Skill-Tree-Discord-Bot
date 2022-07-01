const {MessageActionRow, MessageSelectMenu, MessageEmbed, MessageButton} = require("discord.js");
const {romanise} = require("../../modules/romanNumeralHelper");
const {updateTask, getCurrentTasks} = require("../../modules/skillAPIHelper");
const {dayToDate, getAbsDate, getDaysBetweenDates} = require("../../modules/dateHelper");
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
    getCurrentTasks(userID,(tasks)=>{
      if (tasks.length === 0) {
        message.channel
          .send("```No Current tasks, go to `~start` to start a skill```")
          .then(msg => {
            setTimeout(() => msg.delete(), 10000);
          });
      } else {
        //Show tasks in embed
        createTaskList(client, message, tasks, userID);
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
 * @return {Promise<void>}
 */
async function createTaskList(client, message, tasks, userID) {
  const dayCreated = new Date();
  let day = "today";
  let date = dayToDate(day);

  const embed = buildEmbed(tasks, date);
  const dropDownBox = createDropDownBox(tasks, date);

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

  const collector = msg.createMessageComponentCollector({time: 120000});

  collector.on("collect", i => {
    if (i.user.id !== message.author.id) {
      i.reply({ content: "You can't edit someone else's task list!", ephemeral: true });
      return;
    }
    if (getDaysBetweenDates(dayCreated, new Date()) !== 0) {
      i.reply({ content: "This task list is outdated, run the command again to get today's tasks", ephemeral: true });
      return;
    }

    if (i.isButton()) {
      day = i.customId; //today or yesterday
      date = dayToDate(day);
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
      task.setChecked(!task.isChecked(date), date);

      updateTask(userID, task, day, task.isChecked(date), (levelUp, unlocked) => {
        if (levelUp !== 0) {
          getUser(userID, message.author.username, (user)=>{
            displayLevelUp(user, message.channel);
          });
        }
        createLargeSwipePanel(client, message.author, message.channel, unlocked);
      });
    }

    // Send the same embed, but with the updated values of the tasks array.
    const embed = buildEmbed(filteredTasks, date);
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

function createDropDownBox(tasks, date) {
  if (tasks.length !== 0) {
    return new MessageActionRow().addComponents(
      new MessageSelectMenu().setCustomId("tasks-selection-box").setPlaceholder("Check/uncheck a task").addOptions(
        tasks.map(
          task => {
            return {
              label: task.child.getName(),
              description: task.child.goal,
              value: task.child.getName(),
              emoji: task.isChecked(date) ? "✅" : "❌",
            };
          }
        )
      )
    );
  }
  return null;
}

// Helper function for building an embed in order to reduce repetition in the code.
function buildEmbed(tasks, date) {
  const month = date.toLocaleString("default", { month: "long" });

  const dateString = `${month} ${date.getDate()}, ${date.getUTCFullYear()}`;
  const challengeTasks = tasks.filter(task => task.child instanceof Challenge);
  const dailyTasks = tasks.filter(task => task.child instanceof Skill && task.child.interval === "day");
  const otherTasks = tasks.filter(task => task.child instanceof Skill && task.child.interval !== "day");

  let dailyTaskStrings = dailyTasks.map((task) => formatTask(task, date)).join("\n");
  let otherTaskStrings = otherTasks.map((task) => formatTask(task, date)).join("\n");
  let challengeTaskStrings = challengeTasks.map((task) => formatTask(task, date)).join("\n");

  if (dailyTaskStrings.length === 0) { dailyTaskStrings = "No daily tasks are available";}
  if (otherTaskStrings.length === 0) { otherTaskStrings = "No other tasks are available";}
  if (challengeTaskStrings.length === 0) { challengeTaskStrings = "No challenges available";}
  return new MessageEmbed()
    .setTitle(`Tasks for ${dateString}`)
    .setColor("#1071E5")
    .addField("Daily Tasks", dailyTaskStrings)
    .addField("Other", otherTaskStrings)
    .addField("Challenges", challengeTaskStrings);
}

function formatTask(task, date) {
  if (task.child instanceof Challenge) {
    const checkedEmoji = task.isChecked(date) ? ":white_check_mark:": ":x:";
    return `${checkedEmoji} | **${task.child.title} (UNCOMPLETE)**: \n${task.child.goal}`;
  }
  if (task.child instanceof Skill) {
    const checkedEmoji = task.isChecked(date) ? ":white_check_mark:": ":x:";
    const levelRoman = romanise(task.child.level);

    return `${checkedEmoji} | **${task.child.title} ${levelRoman} (${task.percentChecked()})**: \n${task.child.goal}`;
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
