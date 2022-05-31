const {MessageActionRow, MessageSelectMenu, MessageEmbed, MessageButton} = require("discord.js");
const {romanise} = require("../../modules/romanNumeralHelper");
const {updateTask, authUser, getCurrentTasks} = require("../../modules/APIHelper");
const {dayToDate, getAbsDate} = require("../../modules/dateHelper");
const {createLargeSwipePanel} = require("../../modules/menuHelper");
const Challenge = require("../../objects/challenge");

/**
 * Sends an embed containing all the tasks under two categories, DAILY and ONGOING
 */
exports.run = async (client, message) => {
  //Validate user exists
  authUser(message.author.id, message.channel, (userID) => {
    //Get tasks
    getCurrentTasks(userID,(tasks)=>{
      if (tasks.length === 0) {
        message.channel.send("```No Current tasks, go to ~skills to start a skill```");
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
async function createTaskList(client, message,tasks, userID) {
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

  const msg = await message.channel.send({ embeds: [embed], components: [dropDownBox, row] });

  const collector = msg.createMessageComponentCollector({time: 30000 });

  collector.on("collect", i => {
    if (i.user.id !== message.author.id) {
      i.reply({ content: "You can't edit someone else's task list!", ephemeral: true });
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
      const task = filteredTasks.find(task => `${task.skill.title}${task.skill.level}` === skillTitle);
      task.setChecked(!task.isChecked(date), date);

      updateTask(userID, task, date, task.isChecked(date), (unlocked)=>{
        message.channel.send({embeds: [
          new MessageEmbed()
            .setTitle("UNLOCKED")
            .setColor("#ffce00")]});
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
              label: `${task.skill.title} ${romanise(task.skill.level)}`,
              description: task.skill.goal,
              value: `${task.skill.title}${task.skill.level}`,
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
  const dailyTasks = tasks.filter(task => task.skill.interval === "day");
  const otherTasks = tasks.filter(task => task.skill.interval !== "day");
  let dailyTaskStrings = dailyTasks.map((task, idx) => formatTask(task, idx, date)).join("\n");
  let otherTaskStrings = otherTasks.map((task, idx) => formatTask(task, idx + dailyTaskStrings.length, date)).join("\n");
  if (dailyTaskStrings.length === 0) { dailyTaskStrings = "No daily tasks are available";}
  if (otherTaskStrings.length === 0) { otherTaskStrings = "No other tasks are available";}
  return new MessageEmbed()
    .setTitle(`Tasks for ${dateString}`)
    .setColor("#1071E5")
    .addField("Daily Tasks", dailyTaskStrings)
    .addField("Ongoing", otherTaskStrings);
}

function formatTask(task, idx, date) {
  const checkedEmoji = task.isChecked(date) ? ":white_check_mark:": ":x:";
  const levelRoman = romanise(task.skill.level);
  //const frequencyFormat = formatFrequency(task.skill.frequency, task.skill.interval);

  return `${checkedEmoji} | **${task.skill.title} ${levelRoman} (${task.percentChecked()})**: \n${task.skill.goal}`;
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
