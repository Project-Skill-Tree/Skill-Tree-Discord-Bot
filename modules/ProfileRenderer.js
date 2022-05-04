const {MessageAttachment, MessageEmbed} = require("discord.js");
const Canvas = require("canvas");
const XPHandler = require("./XPHandler");
const {drawBadge} = require("../objects/badge");

/**
 * Sends an embedded profile summary, including level, character, xp, badges, items, skills, etc.
 * @param user - Skill tree user object
 * @param channel - the channel to send the message to
 */
exports.displayProfile = async function(user, channel) {
  const profileImage = new MessageAttachment(await getProfileImage(user), "profile.png");
  const itemMenu = createItemMenu(user);

  return channel.send({embeds: [itemMenu], files: [profileImage]});
};

/**
 * Generate the profile card for this user
 * @param user - Skill tree user object
 * @return {Promise<Buffer>} buffer -
 */
async function getProfileImage(user) {
  const canvas = Canvas.createCanvas(600, 200);
  const context = canvas.getContext("2d");

  //Canvas settings
  context.antialias = "default";
  context.quality = "nearest";
  context.imageSmoothingEnabled = false;
  context.font = "30px \"Akira\"";

  const color = XPHandler.getColor(user.level);
  context.shadowColor = color;

  const background = await Canvas.loadImage("./assets/backgrounds/bg2.png");
  context.drawImage(background, 0, 0, background.width, background.height);

  const [red, green, blue] = color.substring(color.indexOf("(") + 1, color.lastIndexOf(")")).split(/,\s*/);
  context.fillStyle = `rgba(${red}, ${green}, ${blue}, 0.1)`;
  context.fillRect(0, 0, 600, 200);

  context.shadowBlur = 10;
  context.fillStyle = "rgba(255,255,255,1)";
  context.fillText(user.name, 180, 40, 300);
  context.shadowBlur = 0;

  await drawProfile(canvas, user,80, 130);
  await drawXP(canvas, user,165 + 25,160, 365 - 64, 30);
  await drawProfileInfo(canvas, user);

  //return final buffer
  return canvas.toBuffer();
}

async function drawProfile(canvas, user, profileX, profileWidth) {
  const context = canvas.getContext("2d");

  context.fillStyle = "rgba(0, 0, 0, 0.6)";
  context.fillRect(0, 0, profileX*2, 200);

  //Draw character
  const characterPath = XPHandler.getCharacter(user.level);
  const character = await Canvas.loadImage("./assets/characters/"+characterPath);
  const iconSizeRatio = profileWidth / character.width;

  context.drawImage(character, profileX-profileWidth*0.5,
    canvas.height / 2 - character.height * iconSizeRatio * 0.5 - 10,
    character.width * iconSizeRatio, character.height * iconSizeRatio);

  const LVL = `LVL: ${user.level}`;
  context.font = "20px \"Akira\"";
  context.fillStyle = XPHandler.getColor(user.level);
  context.shadowBlur = 10;

  const textWidth = context.measureText(LVL).width;
  context.fillText(LVL, profileX - textWidth*0.5,190);
  context.shadowBlur = 0;
}

async function drawXP(canvas, user, x, y, w, h) {
  const context = canvas.getContext("2d");
  const maxXP = XPHandler.calcXP(user.level);

  // Fill with gradient
  context.fillStyle = XPHandler.getColor(this.level);
  context.fillRect(x,y,w*Math.min(user.xp, maxXP)/maxXP,h);

  //Draw XP bar outline
  context.strokeStyle = "rgba(255, 255, 255, 0.7)";
  context.lineWidth = 3;
  context.strokeRect(x,y,w,h);
  context.lineWidth = 1;
  context.strokeStyle = "rgba(255, 255, 255, 0)";

  //Draw XP text
  context.font = "15px \"Akira\"";
  const xpText = `${user.xp}XP / ${maxXP}XP`;
  const textWidth = context.measureText(xpText).width;

  //Draw XP text outline
  context.lineWidth = 3;
  context.strokeStyle = "rgb(0,0,0)";
  context.strokeText(xpText, x + w*0.5 - textWidth*0.5, y + h - 10);
  context.lineWidth = 1;

  //Fill XP text
  context.fillStyle = "rgb(255,255,255)";
  context.fillText(xpText, x + w*0.5 - textWidth*0.5, y + h - 10);
}

async function drawProfileInfo(canvas, user) {
  const context = canvas.getContext("2d");
  //Draw badge background
  context.fillStyle = "rgba(255, 187, 0, 0.3)";
  context.fillRect(516, 0, 64+20, 200);

  //Sort badges in descending XP order
  const sortedSkills = user.skills.sort((a, b) => {
    return b.xp - a.xp;
  });

  //draw badges
  for (let i = 0; i < 3; i++) {
    let skill = null;
    if (i < sortedSkills.length) {
      skill = sortedSkills[i];
    }
    if (skill == null) {
      //Draw empty skill badge
      await drawBadge(canvas, 558, 5 + 32 + 64 * i, 60, null, null);
    } else {
      //Draw skill badge
      await drawBadge(canvas, 558, 5 + 32 + 64 * i, 60, skill.iconPath, skill.level);
    }
  }

  //draw INFO
  const totalXP = XPHandler.calcTotalXP(user.level, user.xp);
  const INFO = `Total XP: ${totalXP}XP\n` +
    `Completed Skills: ${user.skills.length}\n`+
    `Current Skills: ${0}\n` +
    `Days Tracked: ${0}`;
  context.font = "20px \"Tahoma\"";
  context.fillStyle = "rgba(255, 255, 255, 0.8)";
  context.fillText(INFO, 190,70);
}

function createItemMenu(user) {
  let items;
  if (user.items.length === 0) {
    items = "```Empty```";
  } else {
    items = user.items.map(item => ` ${item.emoji} [${item.name}](${item.link})`).join("\n");
  }
  return new MessageEmbed()
    .setTitle("INVENTORY 🎒")
    .setColor("#1071E5")
    .setDescription(items);
}