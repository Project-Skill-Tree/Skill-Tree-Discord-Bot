const Canvas = require("canvas");

/** @module UIHelper */

/**
 * Adds glow effect to a given asset
 * @param {string} iconPath - relative path from /assets/
 * @param {number} size - max width/height of the image
 * @param {string=} color - Color of the glow effect to add
 * @returns {Promise<Buffer>} - canvas buffer
 */
exports.addGlow = async function(iconPath, size, color="white") {
  const canvas = Canvas.createCanvas(size, size);
  const context = canvas.getContext("2d");
  context.antialias = "default";
  context.quality = "nearest";
  context.imageSmoothingEnabled = false;
  context.shadowColor = color;
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
};