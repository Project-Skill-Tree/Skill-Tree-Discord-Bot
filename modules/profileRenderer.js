const {MessageAttachment} = require("discord.js");
const Canvas = require("canvas");
const XPHandler = require("./XPHelper");
const {drawBadge} = require("../objects/badge");

/** @module ProfileRenderer */

/**
 * Sends an embedded profile summary, including level, character, xp, badges, items, skills, etc.
 * @param user - User object
 * @param channel - the channel to send the message to
 */
exports.displayProfile = async function(user, channel) {
  //Generate profile
  const profileImage = new MessageAttachment(await getProfileImage(user), "profile.png");
  return channel.send({files: [profileImage]});
};

/**
 * Sends an embedded level-up page, including level, character, xp
 * @param user - User object
 * @param channel - the channel to send the message to
 */
exports.displayLevelUp = async function(user, channel) {
  //Generate profile
  const profileImage = new MessageAttachment(await getLevelUpProfileImage(user), "profile.png");

  return channel.send({files: [profileImage]});
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
  context.imageSmoothingEnabled = true;
  context.font = "30px \"Akira\"";

  const color = XPHandler.getColor(user.level);
  context.shadowColor = color;

  //Draw background
  const background = await Canvas.loadImage("./assets/backgrounds/bg2.png");
  context.drawImage(background, 0, 0, background.width, background.height);

  //Extract RGB values from rank colour, then set alpha to 0.1
  //Used for tinting the background
  const [red, green, blue] = color.substring(color.indexOf("(") + 1, color.lastIndexOf(")")).split(/,\s*/);
  context.fillStyle = `rgba(${red}, ${green}, ${blue}, 0.1)`;
  context.fillRect(0, 0, 600, 200);

  //Draw username
  context.shadowBlur = 10;
  context.fillStyle = "rgba(255,255,255,1)";
  context.fillText(user.name, 180, 40, 300);
  context.shadowBlur = 0;

  await drawProfile(canvas, user,80, 140, 130);
  await drawXP(canvas, user,165 + 25,160, 365 - 64, 30);
  await drawProfileInfo(canvas, user);

  //return final buffer
  return canvas.toBuffer();
}

/**
 * Generate the level-up profile card for this user
 * @param user - Skill tree user object
 * @return {Promise<Buffer>} buffer -
 */
async function getLevelUpProfileImage(user) {
  const canvas = Canvas.createCanvas(600, 200);
  const context = canvas.getContext("2d");

  //Canvas settings
  context.imageSmoothingEnabled = true;
  context.font = "30px \"Akira\"";

  const color = XPHandler.getColor(user.level);
  context.shadowColor = color;

  //Draw background
  const background = await Canvas.loadImage("./assets/backgrounds/bg2.png");
  context.drawImage(background, 0, 0, background.width, background.height);

  //Extract RGB values from rank colour, then set alpha to 0.1
  //Used for tinting the background
  const [red, green, blue] = color.substring(color.indexOf("(") + 1, color.lastIndexOf(")")).split(/,\s*/);
  context.fillStyle = `rgba(${red}, ${green}, ${blue}, 0.1)`;
  context.fillRect(0, 0, 600, 200);

  await drawProfile(canvas, user,80, 140, 130);
  await drawXP(canvas, user,190,130, 380, 30);

  context.shadowBlur = 10;
  context.fillStyle = "rgba(255,255,255,1)";
  context.font = "60px \"Akira\"";
  context.fillText("LEVEL UP", 230, 100, 300);
  context.shadowBlur = 0;

  //return final buffer
  return canvas.toBuffer();
}

/**
 * Draw character and level
 * @param canvas - canvas object
 * @param user - user object
 * @param profileX - X midpoint of the profile
 * @param profileWidth - width of the profile
 * @param profileHeight - height of the drawing
 * @return {Promise<void>}
 */
async function drawProfile(canvas, user, profileX, profileWidth, profileHeight) {
  const context = canvas.getContext("2d");

  context.fillStyle = "rgba(0, 0, 0, 0.6)";
  context.fillRect(0, 0, profileX*2, 200);

  //Draw character
  const characterPath = XPHandler.getCharacter(user.level);
  const character = await Canvas.loadImage("./assets/characters/"+characterPath);
  const iconSizeRatio = Math.min(profileWidth / character.width, profileHeight / character.height);

  //Draw with glow
  context.shadowColor = XPHandler.getColor(user.level);
  context.shadowBlur = 15;

  context.drawImage(character,
    profileX - character.width * iconSizeRatio * 0.5,
    canvas.height / 2 - character.height * iconSizeRatio * 0.5 - 10,
    character.width * iconSizeRatio,
    character.height * iconSizeRatio);

  context.shadowBlur = 0;

  //Draw user's level
  const LVL = `LVL: ${user.level}`;
  context.font = "20px \"Akira\"";
  context.fillStyle = "white";
  context.shadowBlur = 10;
  const textWidth = context.measureText(LVL).width;
  context.fillText(LVL, profileX - textWidth*0.5,180);
  context.shadowBlur = 0;
}

/**
 * Draw XP bar
 * @param canvas - canvas object
 * @param user - user object
 * @param x - x start coordinate
 * @param y - y start coordinate
 * @param w - width of XP bar
 * @param h - height of XP bar
 * @return {Promise<void>}
 */
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

/**
 * Draw profile information
 * 1. Total XP
 * 2. Completed Skills
 * 3. Current skills
 * 4. Days tracked
 * @param canvas
 * @param user
 * @return {Promise<void>}
 */
async function drawProfileInfo(canvas, user) {
  const context = canvas.getContext("2d");
  //Draw badge background
  context.fillStyle = "rgba(255, 187, 0, 0.3)";
  context.fillRect(516, 0, 64+20, 200);

  //Sort badges in descending XP order
  const sortedSkills = user.skills.sort((a, b) => {
    return (b.level !== a.level) ? (b.level - a.level) : b.xp - a.xp;
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
      await drawBadge(canvas, 558, 5 + 32 + 64 * i, 60, skill.icon, skill.level);
    }
  }

  //draw INFO
  const INFO = `Total XP: ${user.xp}XP\n` +
    `Completed Skills: ${user.skills.length}\n`+
    `Current Skills: ${user.skillsinprogress.length}\n` +
    `Days Tracked: ${0}`;
  context.font = "20px \"Tahoma\"";
  context.fillStyle = "rgba(255, 255, 255, 0.8)";
  context.fillText(INFO, 190,70);
}
