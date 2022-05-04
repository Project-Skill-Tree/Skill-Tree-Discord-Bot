const {MessageAttachment} = require("discord.js");
const Canvas = require("canvas");
const XPHandler = require("./XPHandler");
const Skill = require("../objects/skill");
const Task = require("../objects/task");
const {romanise} = require("./romanNumeralHelper");

const taskList = [
  new Skill("reading.png","Reading", 4, "READ 30m", 1, "day", 30, 800),
  new Skill("meditation.png","Meditation", 1, "Meditate for 30m", 3, "day", 30, 2000),
  new Skill("exercise.png","Exercise", 3, "Hit PRs in every exercise", 5, "week", 30, 100)
].map(skill => new Task(0, skill,
  Array.from({length: 7}, () => Math.random() > 0.3)));


/**
 * Sends an embedded weekly review, including xp gained, new items, skills completed
 * skill consistency and more
 * @param user - Skill tree user object
 * @param channel - the channel to send the message to
 */
exports.displayReview = async function(user, channel) {
  const reviewImage = new MessageAttachment(await getWeeklyReview(user), `${user.name}_review.png`);

  return channel.send({files: [reviewImage]});
};

/**
 * Generate the weekly review for this user
 * @param user - Skill tree user object
 * @return {Promise<Buffer>} buffer -
 */
async function getWeeklyReview(user) {
  const canvas = Canvas.createCanvas(400, 800);
  const context = canvas.getContext("2d");

  //Canvas settings
  context.antialias = "default";
  context.quality = "nearest";
  context.imageSmoothingEnabled = false;
  context.font = "30px \"Akira\"";

  //background
  const background = await Canvas.loadImage("./assets/backgrounds/weekly_report.png");
  context.drawImage(background, 0, 0, background.width, background.height);

  await drawHeaderFooter(canvas);

  await drawXP(canvas, user,20, 150, 360, 30);
  await drawTasks(canvas, user,0,190,400,200);

  //return final buffer
  return canvas.toBuffer();
}


async function drawHeaderFooter(canvas) {
  const context = canvas.getContext("2d");
  context.font = "30px \"Akira\"";

  const header = await Canvas.loadImage("./assets/backgrounds/bg2.png");
  context.drawImage(header, 0, -80, header.width, header.height);

  const footer = await Canvas.loadImage("./assets/backgrounds/bg2.png");
  context.drawImage(footer, 0, 800 - 50, footer.width, footer.height);

  context.shadowColor = "rgba(255,198,7,1.0)";
  context.shadowBlur = 10;
  context.fillStyle = "rgba(255,255,255,1)";
  const title = "WEEKLY REPORT";
  const headerWidth = context.measureText(title).width;
  context.fillText(title, 200 - headerWidth*0.5, 70);
  context.shadowBlur = 20;
  context.fillRect(0,120,400,3);

  context.shadowBlur = 20;
  context.fillRect(0,800 - 50,400,3);
  context.shadowBlur = 0;

  context.font = "15px \"Akira\"";
  context.shadowBlur = 5;
  const footerText = "SKILL TREE";
  const footerWidth = context.measureText(footerText).width;
  context.fillText(footerText, 200 - footerWidth*0.5, 785);
  context.shadowBlur = 0;

  const logo = await Canvas.loadImage("./assets/skilltree/logo_gold.png");
  const iconSizeRatio = Math.min(32 / logo.width, 32 / logo.height);
  context.drawImage(logo,
    200 - footerWidth*0.5 - 32 - 10,
    800 - 25 - 16,
    logo.width*iconSizeRatio,
    logo.height*iconSizeRatio);
}

async function drawXP(canvas, user, x, y, w, h) {
  const context = canvas.getContext("2d");
  const maxXP = XPHandler.calcXP(user.level);

  const prevLevel = user.level;
  const prevXP = user.xp * 0.5;

  //Add extra text to show increase
  context.font = "16px \"Akira\"";
  const xpIncrease = XPHandler.calcTotalXP(user.level, user.xp) - XPHandler.calcTotalXP(prevLevel, prevXP);
  const increaseText = `+ ${xpIncrease} XP`;
  const increaseTextWidth = context.measureText(increaseText).width;
  const XPwidth = w - increaseTextWidth - 10;

  context.fillStyle = "rgb(255,255,255)";
  context.fillText(increaseText, x + XPwidth + 10, y + h - 10, increaseTextWidth);

  // Fill with lighter gradient for newXP
  const color = XPHandler.getColor(user.level);
  let [red, green, blue] = color.substring(color.indexOf("(") + 1, color.lastIndexOf(")")).split(/,\s*/);
  red = Math.floor(Math.min(red * 2, 254));
  green = Math.floor(Math.min(green * 2, 254));
  blue = Math.floor(Math.min(blue * 2, 254));

  context.fillStyle = `rgba(${red}, ${green}, ${blue}, 1.0)`;
  context.fillRect(x,y,XPwidth*Math.min(user.xp, maxXP)/maxXP,h);

  //Fill to show last level XP
  if (prevLevel === user.level) {
    context.fillStyle = XPHandler.getColor(user.level);
    context.fillRect(x,y,XPwidth*Math.min(prevXP, maxXP)/maxXP,h);
  }

  //Draw XP bar outline
  context.strokeStyle = "rgba(255, 255, 255, 0.7)";
  context.lineWidth = 3;
  context.strokeRect(x,y,XPwidth,h);
  context.lineWidth = 1;
  context.strokeStyle = "rgba(255, 255, 255, 0)";

  //Draw XP text
  context.font = "15px \"Akira\"";
  const xpText = `${user.xp}XP / ${maxXP}XP`;
  const textWidth = context.measureText(xpText).width;

  //Draw XP text outline
  context.lineWidth = 3;
  context.strokeStyle = "rgb(0,0,0)";
  context.strokeText(xpText, x + XPwidth*0.5 - textWidth*0.5, y + h - 10);
  context.lineWidth = 1;

  //Fill XP text
  context.fillStyle = "rgb(255,255,255)";
  context.fillText(xpText, x + XPwidth*0.5 - textWidth*0.5, y + h - 10);
}

async function drawTasks(canvas, user, x, y, w, h) {
  const context = canvas.getContext("2d");
  const pad = 10;

  //Sort badges in descending XP order
  const tasks = taskList.sort((a, b) => {
    return b.xp - a.xp;
  });

  let maxSize = 0;
  for (let i = 0; i < tasks.length; i++) {
    maxSize = Math.max(maxSize, tasks[i].completed.length);
  }

  //Width of one habit
  const tHeight = (h - pad*2) / tasks.length;
  const tWidth = (w - pad*2 - tHeight - 10) / maxSize;
  const size = Math.min(tHeight, tWidth) - 4;

  //draw habits
  tasks.map(async (task, index) => {
    //Draw task icon
    context.fillStyle = "rgba(255, 255, 255, 1.0)";
    context.strokeStyle = "rgba(255, 255, 255, 1.0)";
    context.lineWidth = 3;
    context.strokeRect(
      x + pad + 4,
      y + pad + tHeight*index + 4,
      tHeight - 8,
      tHeight - 8);
    context.lineWidth = 1;
    const icon = await Canvas.loadImage("./assets/icons/" + task.skill.iconPath);
    const iconSizeRatio = Math.min((tHeight - 10) / icon.width, (tHeight - 10) / icon.height);
    context.drawImage(icon,
      x + pad + 5,
      y + pad + 5 + tHeight*index,
      icon.width * iconSizeRatio,
      icon.height * iconSizeRatio);
    const level = `${romanise(task.skill.level)}`;
    const lvlWidth = context.measureText(level).width;
    context.font = "15px \"Akira\"";
    context.strokeStyle = "rgba(0,0,0,1.0)";
    context.lineWidth = 3;
    context.strokeText(level,
      x + pad + tHeight*0.5 - lvlWidth*0.5,
      y + pad + tHeight*index + tHeight*0.9);
    context.lineWidth = 1;
    context.fillStyle = "rgba(255, 255, 255, 1.0)";
    context.fillText(level,
      x + pad + tHeight*0.5 - lvlWidth*0.5,
      y + pad + tHeight*index + tHeight*0.9);

    //Draw day completion chart
    context.shadowBlur = 0;
    context.strokeStyle = "rgba(0,0,0,0)";
    context.fillStyle = "rgba(20, 20, 20, 1.0)";
    context.fillRect(
      x + tHeight + pad + 5,
      y + pad + index*tHeight + tHeight*0.5 - size*0.5 - 5,
      w - pad*2 - tHeight,
      size + 15);
    for (let i = 0; i < task.completed.length; i++) {
      if (task.completed[i]) context.fillStyle = "rgba(108, 199, 78,0.8)";
      else context.fillStyle = "rgba(102, 102, 102, 0.6)";
      context.fillRect(
        x + w - pad - tWidth*(i+1) + 2,
        y + pad + index*tHeight + tHeight*0.5 - size*0.5 + 2,
        size,
        size);
    }

    //Draw completion percentage
    context.font = "25px \"Akira\"";
    const percent = Math.floor(100 * task.completed.filter(Boolean).length / task.completed.length);
    const text = `${percent}%`;
    const percentMetric = context.measureText(text);
    const textHeight = percentMetric.actualBoundingBoxAscent + percentMetric.actualBoundingBoxDescent;
    const textWidth = percentMetric.width;

    context.strokeStyle = "rgba(0,0,0,1.0)";
    context.lineWidth = 3;
    context.strokeText(text,
      x + w * 0.5 + tHeight*0.5 - textWidth*0.5,
      y + pad + tHeight*index + tHeight*0.5 + textHeight*0.5);
    context.lineWidth = 1;
    context.fillStyle = "rgba(255, 255, 255, 1.0)";
    context.fillText(text,
      x + w * 0.5 + tHeight*0.5 - textWidth*0.5,
      y + pad + tHeight*index + tHeight*0.5 + textHeight*0.5);

    const title = `${task.skill.title} ${romanise(task.skill.level)}`;
    const titleMetric = context.measureText(title);
    const titleHeight = titleMetric.actualBoundingBoxAscent + titleMetric.actualBoundingBoxDescent;
    const titleWidth = titleMetric.width;

    context.strokeStyle = "rgba(0,0,0,1.0)";
    context.lineWidth = 3;
    context.strokeText(title,
      x + w * 0.5 + tHeight*0.5 - titleWidth*0.5,
      y + pad + tHeight*index + titleHeight*0.5);
    context.lineWidth = 1;
    context.fillStyle = "rgba(255, 255, 255, 1.0)";
    context.fillText(title,
      x + w * 0.5 + tHeight*0.5 - titleWidth*0.5,
      y + pad + tHeight*index + titleHeight*0.5);
  });
}