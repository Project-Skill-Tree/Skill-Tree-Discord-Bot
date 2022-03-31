const {MessageEmbed, MessageAttachment} = require("discord.js");
const Canvas = require("canvas");
const config = require("../config");
const XPHandler = require("./XPHandler");
const {drawBadge} = require("./badge");

/**
 * User object
 * @param name - Username of the player
 * @param level - user of the level
 * @param xp - current XP of the player. XP is not counted continuously, it's reset to 0 when the user levels up
 * @param badges - list of badges the user has
 */
class Profile {
  constructor(name, level, xp, skills) {
    this.name = name;
    this.level = level;
    this.xp = xp;
    this.skills = skills;
  }

  /**
   * Sends an embedded profile summary, including level, character, xp, badges, items, skills, etc.
   * @param channel
   */
  async send(channel) {
    //TODO: ddd getCharacter(level) // returns image path of the character asset for this user
    //TODO: add badges menu
    //TODO: add item menu
    const profileImage = new MessageAttachment(await this.getProfileImage(), "profile.png");

    const embed = new MessageEmbed();
    embed.setColor("#7d005d");
    embed.setTitle(`${this.name}`);
    //TODO: embed.setThumbnail("attachment://character.png");
    embed.setTimestamp();
    return channel.send({files: [profileImage]});
  }

  async getProfileImage() {
    const canvas = Canvas.createCanvas(600, 200);
    const context = canvas.getContext("2d");

    //Canvas settings
    context.antialias = "default";
    context.quality = "nearest";
    context.imageSmoothingEnabled = false;
    context.font = "30px \"Akira Expanded\"";

    //TODO: Dynamically update background based on level
    const background = await Canvas.loadImage("./assets/backgrounds/bg.png");
    context.drawImage(background, 0, 0, background.width, background.height);

    await this.drawProfile(canvas, 100, 100, 15);
    await this.drawXP(canvas, 165 + 25,150, 365 - 64, 30);
    await this.drawProfileInfo(canvas);

    //return final buffer
    return canvas.toBuffer();
  }

  async drawProfile(canvas, profileX, profileWidth, padding) {
    const context = canvas.getContext("2d");

    //Draw character background (semi-transparent black band from top to bottom)
    context.fillStyle = "rgba(0, 0, 0, 0.8)";
    context.fillRect(profileX - profileWidth*0.5 - padding,0,profileWidth + padding*2,200);

    //Draw character
    const characterPath = XPHandler.getCharacter(this.level);
    const character = await Canvas.loadImage("./assets/characters/"+characterPath);
    const iconSizeRatio = profileWidth / character.width;
    const pad = 10;

    //Border around character
    context.strokeStyle = "rgba(255, 255, 255, 0.1)";
    context.lineWidth = 4;
    context.strokeRect(profileX-profileWidth*0.5 - pad,
      canvas.height / 2 - character.height * iconSizeRatio * 0.5 - 10 - pad,
      character.width * iconSizeRatio +  + pad*2, character.height * iconSizeRatio + pad*2);
    context.lineWidth = 1;

    context.drawImage(character, profileX-profileWidth*0.5,
      canvas.height / 2 - character.height * iconSizeRatio * 0.5 - 10,
      character.width * iconSizeRatio, character.height * iconSizeRatio);

    //Get level description (e.g. use, bot admin, bot owner)
    const friendly = config.permLevels.find(l => l.level === this.level).name;
    const textWidth = context.measureText(`${friendly}`).width;
    //Draw black textbox
    context.fillStyle = "rgba(0, 0, 0, 0.8)";
    context.fillRect(profileX - (textWidth*0.5) - 10, 180 - 30, textWidth + 20, 40);
    context.strokeStyle = "rgba(247, 12, 190, 0.7)";
    context.strokeRect(profileX - (textWidth*0.5) - 10, 180 - 30, textWidth + 20, 40);

    //Draw Level name
    context.fillStyle = "rgb(255, 255, 255)";
    context.fillText(`${friendly}`, profileX - (textWidth*0.5), 180);
  }

  async drawXP(canvas, x, y, w, h) {
    const context = canvas.getContext("2d");
    const maxXP = XPHandler.calcXP(this.level);

    //Draw XP bar
    context.fillStyle = "rgba(92, 176, 32, 0.7)";
    context.fillRect(x,y,w*this.xp/maxXP,h);

    //Draw XP bar outline
    context.strokeStyle = "rgba(255, 255, 255, 0.7)";
    context.lineWidth = 3;
    context.strokeRect(x,y,w,h);
    context.lineWidth = 1;
    context.strokeStyle = "rgba(255, 255, 255, 0)";

    //Draw XP text
    const xpText = `${this.xp}XP / ${maxXP}XP`;
    const textWidth = context.measureText(xpText).width;

    //Draw XP text outline
    context.lineWidth = 3;
    context.strokeStyle = "rgb(0,0,0)";
    context.strokeText(xpText, x + w*0.5 - textWidth*0.5, y + h);
    context.lineWidth = 1;

    //Fill XP text
    context.fillStyle = "rgb(255,255,255)";
    context.fillText(xpText, x + w*0.5 - textWidth*0.5, y + h);
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
    context.font = "20px \"Akira Expanded\"";
    context.fillStyle = "rgba(255, 255, 255, 0.9)";
    context.fillText(INFO, 190,40);
  }
}

module.exports = Profile;
