const Canvas = require("canvas");
const {tint} = require("../modules/UIHelper");

/** @module badge */

/**
 * Get the badge image
 * @param {?string} iconPath - Path to the badge icon, relative to the /icons/ folder
 * @param {?number} level - Skill level of the badge
 * @param {number} size - size of badge icon
 * @param {?number} level - Level of the badge as a number
 * @return {Promise<Buffer>} - returns ImageBuffer of the badge
 */
exports.getBadgeIcon = async function(iconPath, level, size) {
  const canvas = Canvas.createCanvas(size, size);
  const context = canvas.getContext("2d");
  context.quality = "good";
  context.imageSmoothingEnabled = false;

  await exports.drawBadge(canvas, canvas.width/2, canvas.height/2, size*0.8, iconPath, level);
  return canvas.toBuffer();
};

/**
 * Draw the badge onto a canvas at a given location
 * @param canvas - Canvas to draw the badge onto
 * @param x - X coordinate of the centre of the badge
 * @param y - Y coordinate of the centre of the badge
 * @param size - Size of the badge
 * @param {?string} iconPath - Path to the badge icon, relative to the /icons/ folder
 * @param {?number} level - badge level
 * @return {Promise<void>}
 */
exports.drawBadge = async function(canvas, x, y, size, iconPath, level) {
  const context = canvas.getContext("2d");
  context.shadowColor = "white";

  //Add badge background
  if (level != null) {
    const background = await Canvas.loadImage(`./assets/badges/${level}.png`);
    //Center image in canvas
    const backgroundSizeRatio = size / background.width;
    context.drawImage(background, x - background.width * backgroundSizeRatio * 0.5,
      y - background.height * backgroundSizeRatio * 0.5,
      background.width * backgroundSizeRatio, background.height * backgroundSizeRatio);
  } else {
    const background = await Canvas.loadImage("./assets/badges/empty.png");
    //Center image in canvas
    const backgroundSizeRatio = size / background.width;
    context.drawImage(background, x - background.width * backgroundSizeRatio * 0.5,
      y - background.height * backgroundSizeRatio * 0.5,
      background.width * backgroundSizeRatio, background.height * backgroundSizeRatio);
  }

  if (iconPath != null) {
    let icon = null;
    //Parse the icon file type
    const type = iconPath.split(".").pop();
    switch (type) {
      case "png":
      case "jpg":
        icon = await Canvas.loadImage("./assets/icons/" + iconPath);
        break;
      default:
        return;
    }
    //Add badge icon
    context.shadowBlur = 0;
    //Centre icon in the canvas (+ additional buffer because the badge is isometric
    //and we want to centre it on the top face
    const iconSizeRatio = Math.min(size*0.4 / icon.width, size*0.4 / icon.height);

    // draw image
    context.drawImage(tint(icon, "#120024"), x - icon.width * iconSizeRatio * 0.5,
      y - icon.height*iconSizeRatio*0.5 - 5*(size/64), icon.width * iconSizeRatio, icon.height * iconSizeRatio);

    //Draw normal
    context.drawImage(icon, x - icon.width * iconSizeRatio * 0.5,
      y - icon.height*iconSizeRatio*0.5 - 8*(size/64), icon.width * iconSizeRatio, icon.height * iconSizeRatio);
    context.shadowBlur = 0;
  }
};
