const {MessageEmbed, MessageAttachment} = require("discord.js");
const Canvas = require("canvas");
const XPHandler = require("../modules/XPHandler");
const {drawBadge} = require("./badge");

/**
 * User object
 */
class Profile {
  /**
   * Player profile constructor
   * @constructor
   * @param name - Username of the player
   * @param level - Level of the user
   * @param xp - current XP of the player. XP is not counted continuously, it's reset to 0 when the user levels up
   * @param skills - list of skills the user has completed
   */
  constructor(name, level, xp, skills) {
    this.name = name;
    this.level = level;
    this.xp = xp;
    this.skills = skills;
  }

  /**
   * Sends an embedded profile summary, including level, character, xp, badges, items, skills, etc.
   * @param channel - the channel to send the message to
   */
  async send(channel) {
    //TODO: add item menu
    const profileImage = new MessageAttachment(await this.getProfileImage(), "profile.png");

    const embed = new MessageEmbed();
    embed.setColor("#7d005d");
    embed.setTitle(`${this.name}`);
    embed.setTimestamp();
    return channel.send({files: [profileImage]});
  }

  /**
   * Generate the profile card for this user
   * @return {Promise<Buffer>} buffer -
   */
  async getProfileImage() {
    const canvas = Canvas.createCanvas(600, 200);
    const context = canvas.getContext("2d");

    //Canvas settings
    context.antialias = "default";
    context.quality = "nearest";
    context.imageSmoothingEnabled = false;
    context.font = "30px \"Akira\"";

    const color = XPHandler.getColor(this.level);
    context.shadowColor = color;

    //TODO: Dynamically update background based on level
    const background = await Canvas.loadImage("./assets/backgrounds/bg2.png");
    context.drawImage(background, 0, 0, background.width, background.height);

    const [red, green, blue, opacity] = color.substring(color.indexOf("(") + 1, color.lastIndexOf(")")).split(/,\s*/);
    context.fillStyle = `rgba(${red}, ${green}, ${blue}, 0.1)`;
    context.fillRect(0, 0, 600, 200);

    context.shadowBlur = 10;
    context.fillStyle = "rgba(255,255,255,1)";
    context.fillText(this.name, 180, 40, 300);
    context.shadowBlur = 0;

    await this.drawProfile(canvas, 100, 130);
    await this.drawXP(canvas, 165 + 25,160, 365 - 64, 30);
    await this.drawProfileInfo(canvas);

    //return final buffer
    return canvas.toBuffer();
  }

  async drawProfile(canvas, profileX, profileWidth) {
    const context = canvas.getContext("2d");

    context.fillStyle = "rgba(0, 0, 0, 0.6)";
    context.fillRect(0, 0, profileX, 200);

    //Draw character
    const characterPath = XPHandler.getCharacter(this.level);
    const character = await Canvas.loadImage("./assets/characters/"+characterPath);
    const iconSizeRatio = profileWidth / character.width;

    context.drawImage(character, profileX-profileWidth*0.5,
      canvas.height / 2 - character.height * iconSizeRatio * 0.5 - 10,
      character.width * iconSizeRatio, character.height * iconSizeRatio);

    const LVL = `LVL: ${this.level}`;
    context.font = "20px \"Akira\"";
    context.fillStyle = XPHandler.getColor(this.level);
    context.shadowBlur = 10;

    const textWidth = context.measureText(LVL).width;
    context.fillText(LVL, profileX - textWidth*0.5,190);
    context.shadowBlur = 0;
  }

  async drawXP(canvas, x, y, w, h) {
    const context = canvas.getContext("2d");
    const maxXP = XPHandler.calcXP(this.level);

    // Fill with gradient
    context.fillStyle = XPHandler.getColor(this.level);
    context.fillRect(x,y,w*Math.min(this.xp, maxXP)/maxXP,h);

    //Draw XP bar outline
    context.strokeStyle = "rgba(255, 255, 255, 0.7)";
    context.lineWidth = 3;
    context.strokeRect(x,y,w,h);
    context.lineWidth = 1;
    context.strokeStyle = "rgba(255, 255, 255, 0)";

    //Draw XP text
    context.font = "15px \"Akira\"";
    const xpText = `${this.xp}XP / ${maxXP}XP`;
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

  async drawProfileInfo(canvas) {
    const context = canvas.getContext("2d");
    //Draw badge background
    context.fillStyle = "rgba(255, 187, 0, 0.3)";
    context.fillRect(516, 0, 64+20, 200);

    //Sort badges in descending XP order
    const sortedSkills = this.skills.sort((a, b) => {
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
        await drawBadge(canvas, 558, 5 + 32 + 64 * i, null, "empty.png", null);
      } else {
        //Draw skill badge
        await drawBadge(canvas, 558, 5 + 32 + 64 * i , skill.iconPath, "advanced.png", skill.level);
      }
    }

    //draw INFO
    const totalXP = XPHandler.calcTotalXP(this.level,this.xp);
    const INFO = `Total XP: ${totalXP}XP\n` +
                  `Completed Skills: ${this.skills.length}\n`+
                  `Current Skills: ${3}\n` +
                  `Days Tracked: ${52}`;
    context.font = "20px \"Tahoma\"";
    context.fillStyle = "rgba(255, 255, 255, 0.8)";
    context.fillText(INFO, 190,70);
  }
}

module.exports = Profile;
