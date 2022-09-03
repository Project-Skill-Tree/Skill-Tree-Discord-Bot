const Canvas = require("canvas");

/** @module UIHelper */

/**
 * Adds glow effect to a given asset and resizes it
 * @param {string} iconPath - relative path of icon from /assets/ folder
 * @param {number} size - max width/height of the image
 * (scales to fit as much as possible whilst contained)
 * @param {string=} color - Color of the glow effect to add (default: white)
 * @returns {Promise<Buffer>} - canvas buffer
 */
exports.addGlow = async (iconPath, size, color = "white") => {
  const canvas = Canvas.createCanvas(size, size);
  const context = canvas.getContext("2d");
  context.quality = "bilinear";
  context.imageSmoothingEnabled = false;
  context.shadowColor = color;
  context.shadowBlur = 10;

  const icon = await Canvas.loadImage("./assets/" + iconPath);
  //Centre icon in the canvas
  const iconSizeRatio = Math.min(size / icon.width, size / icon.height);
  context.drawImage(icon, canvas.width/2 - icon.width * iconSizeRatio * 0.5,
    canvas.height/2 - icon.height * iconSizeRatio * 0.5,
    icon.width * iconSizeRatio, icon.height * iconSizeRatio);
  context.shadowBlur = 0;
  return canvas.toBuffer();
};

/**
 * Converts an image file into a buffer
 * @param {string} iconPath - relative path from /assets/ folder
 * @param {number} size - max width/height of the image
 * (scales to fit as much as possible whilst contained)
 * @returns {Promise<Buffer>} - canvas buffer
 */
exports.imageToBuffer = async (iconPath, size) => {
  const canvas = Canvas.createCanvas(size, size);
  const context = canvas.getContext("2d");

  const icon = await Canvas.loadImage("./assets/" + iconPath);
  //Centre icon in the canvas
  const iconSizeRatio = Math.min(size / icon.width, size / icon.height);
  context.drawImage(icon, canvas.width/2 - icon.width * iconSizeRatio * 0.5,
    canvas.height/2 - icon.height * iconSizeRatio * 0.5,
    icon.width * iconSizeRatio, icon.height * iconSizeRatio);

  return canvas.toBuffer();
};

/**
 * Draws a rounded rectangle using the current state of the canvas.
 * If you omit the last three params, it will draw a rectangle
 * outline with a 5 pixel border radius
 * @param {CanvasRenderingContext2D} ctx
 * @param {Number} x The top left x coordinate
 * @param {Number} y The top left y coordinate
 * @param {Number} width The width of the rectangle
 * @param {Number} height The height of the rectangle
 * @param {Number} [radius = 5] The corner radius; It can also be an object
 *                 to specify different radii for corners
 * @param {Number} [radius.tl = 0] Top left
 * @param {Number} [radius.tr = 0] Top right
 * @param {Number} [radius.br = 0] Bottom right
 * @param {Number} [radius.bl = 0] Bottom left
 */
exports.fillRoundRect = (ctx, x, y,
  width, height, radius) => {
  if (typeof radius === "number") {
    radius = {tl: radius, tr: radius, br: radius, bl: radius};
  } else {
    const defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
    for (const side in defaultRadius) {
      radius[side] = radius[side] || defaultRadius[side];
    }
  }
  ctx.beginPath();
  ctx.moveTo(x + radius.tl, y);
  ctx.lineTo(x + width - radius.tr, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
  ctx.lineTo(x + width, y + height - radius.br);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
  ctx.lineTo(x + radius.bl, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
  ctx.lineTo(x, y + radius.tl);
  ctx.quadraticCurveTo(x, y, x + radius.tl, y);
  ctx.closePath();
  ctx.fill();
};

/**
 * Strokes a rounded rectangle using the current state of the canvas.
 * If you omit the last three params, it will draw a rectangle
 * outline with a 5 pixel border radius
 * @param {CanvasRenderingContext2D} ctx
 * @param {Number} x The top left x coordinate
 * @param {Number} y The top left y coordinate
 * @param {Number} width The width of the rectangle
 * @param {Number} height The height of the rectangle
 * @param {Number} [radius = 5] The corner radius; It can also be an object
 *                 to specify different radii for corners
 * @param {Number} [radius.tl = 0] Top left
 * @param {Number} [radius.tr = 0] Top right
 * @param {Number} [radius.br = 0] Bottom right
 * @param {Number} [radius.bl = 0] Bottom left
 */
exports.strokeRoundRect = (ctx, x, y,
  width, height, radius) => {
  if (typeof radius === "number") {
    radius = {tl: radius, tr: radius, br: radius, bl: radius};
  } else {
    const defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
    for (const side in defaultRadius) {
      radius[side] = radius[side] || defaultRadius[side];
    }
  }
  ctx.beginPath();
  ctx.moveTo(x + radius.tl, y);
  ctx.lineTo(x + width - radius.tr, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
  ctx.lineTo(x + width, y + height - radius.br);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
  ctx.lineTo(x + radius.bl, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
  ctx.lineTo(x, y + radius.tl);
  ctx.quadraticCurveTo(x, y, x + radius.tl, y);
  ctx.closePath();
  ctx.stroke();
};

/**
 * Draw image to buffer with the colour given
 * @param img - image object to draw
 * @param colour - colour to draw as
 * @return {Canvas}
 */
exports.tint = (img, colour) => {
  const w = img.width;
  const h = img.height;
  const canvas = Canvas.createCanvas(w, h);
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = colour;
  ctx.fillRect(0,0, w, h);
  ctx.globalCompositeOperation = "destination-in";
  ctx.drawImage( img, 0, 0 );

  ctx.globalCompositeOperation = "source-out";

  return canvas;
};

/**
 * Returns a string embedded in a code block ```like this```
 * @param str
 * @return {string}
 */

exports.codeBlock = str => "```" + str + "```"

/**
 * Split array into chunks of size n
 * @param {Object[]} arr
 * @param {number} chunkSize
 * @return {Object[]}
 */
exports.splitToN = (arr, chunkSize) => {
  const res = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    const chunk = arr.slice(i, i + chunkSize);
    res.push(chunk);
  }
  return res;
};
