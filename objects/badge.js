const Canvas = require("canvas");
const romanise = require("../modules/romanNumeralHelper");

exports.getBadgeIcon = async function(iconPath, backgroundPath, level=null) {
  const canvas = Canvas.createCanvas(64, 64);
  const context = canvas.getContext("2d");
  context.antialias = "default";
  context.quality = "nearest";
  context.imageSmoothingEnabled = false;

  await exports.drawBadge(canvas, canvas.width/2, canvas.height/2, iconPath, backgroundPath, level);
  return canvas.toBuffer();
};

exports.drawBadge = async function(canvas, x, y, iconPath, backgroundPath, level=null) {
  const context = canvas.getContext("2d");
  context.shadowColor = "white";

  //Add badge background
  if (backgroundPath != null) {
    const background = await Canvas.loadImage("./assets/badges/" + backgroundPath);
    //Center image in canvas
    const backgroundSizeRatio = Math.min(60 / background.width, 60 / background.height);
    context.drawImage(background, x - background.width * backgroundSizeRatio * 0.5,
      y - background.height * backgroundSizeRatio * 0.5,
      background.width * backgroundSizeRatio, background.height * backgroundSizeRatio);
  }

  if (iconPath != null) {
    //Add badge icon
    context.shadowBlur = 10;
    const icon = await Canvas.loadImage("./assets/icons/" + iconPath);
    //Centre icon in the canvas (+ additional buffer because the badge is isometric
    //and we want to centre it on the top face
    const iconSizeRatio = Math.min(32 / icon.width, 32 / icon.height);
    context.drawImage(icon, x - icon.width * iconSizeRatio * 0.5,
      y - icon.height * iconSizeRatio * 0.5 - 5, icon.width * iconSizeRatio, icon.height * iconSizeRatio);
    context.shadowBlur = 0;
  }
  //Add level icon
  if (level != null && level > 0 && level < 6) {
    const levelPath = `./assets/levels/${romanise(level)}.png`;
    const leveIcon = await Canvas.loadImage(levelPath);

    //Set level size to 20w 20h and add it to the bottom of the image
    const levelSizeRatio = Math.min(20 / leveIcon.width, 20 / leveIcon.height);
    context.drawImage(leveIcon, x - leveIcon.width * levelSizeRatio * 0.5,
      y + 20 - leveIcon.height * levelSizeRatio * 0.5,
      leveIcon.width * levelSizeRatio,
      leveIcon.height * levelSizeRatio);
  }
};

/**
 * Adds glow effect to icon (for items/challenges)
 * @param iconPath - relative path from /assets/
 * @param size - max width/height of the image
 * @returns {Promise<Buffer>}
 */
exports.addGlow = async function(iconPath, size) {
  const canvas = Canvas.createCanvas(size, size);
  const context = canvas.getContext("2d");
  context.antialias = "default";
  context.quality = "nearest";
  context.imageSmoothingEnabled = false;
  context.shadowColor = "white";
  context.shadowBlur = 10;

  const icon = await Canvas.loadImage("./assets/" + iconPath);
  //Centre icon in the canvas (+ additional buffer because the badge is isometric
  //and we want to centre it on the top face
  const iconSizeRatio = Math.min(size / icon.width, size / icon.height);
  context.drawImage(icon, canvas.width/2 - icon.width * iconSizeRatio * 0.5,
    canvas.height/2 - icon.height * iconSizeRatio * 0.5,
    icon.width * iconSizeRatio, icon.height * iconSizeRatio);
  context.shadowBlur = 0;
  return canvas.toBuffer();
}