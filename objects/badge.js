const Canvas = require("canvas");
const romanise = require("./romanNumeralHelper");

module.exports = async function(iconPath, level, backgroundPath) {
  const canvas = Canvas.createCanvas(64, 64);
  const context = canvas.getContext("2d");

  //Add badge background
  const background = await Canvas.loadImage("./assets/badges/"+backgroundPath);
  //Center image in canvas
  context.drawImage(background, canvas.width/2 - background.width/2,
    canvas.height/2 - background.height/2, background.width, background.height);

  //Add badge icon
  const icon = await Canvas.loadImage("./assets/icons/"+iconPath);
  //Centre icon in the canvas (+ additional buffer because the badge is isometric
  //and we want to centre it on the top face
  var iconSizeRatio = Math.min ( 32 / icon.width, 32 / icon.height);
  context.drawImage(icon, canvas.width/2 - icon.width * iconSizeRatio * 0.5,
    canvas.height/2 - icon.height * iconSizeRatio * 0.5 - 5, icon.width * iconSizeRatio, icon.height * iconSizeRatio);

  //Add level icon
  var levelPath = `./assets/levels/${romanise(level)}.png`;
  const leveIcon = await Canvas.loadImage(levelPath);

  //Set level size to 20w 20h and add it to the bottom of the image
  var ratio = Math.min ( 20 / leveIcon.width, 20 / leveIcon.height);
  context.drawImage(leveIcon, canvas.width/2 - leveIcon.width * ratio*0.5,
    canvas.height*0.8 - leveIcon.height * ratio * 0.5, leveIcon.width * ratio, leveIcon.height * ratio);

  //return final buffer
  return canvas.toBuffer();
};