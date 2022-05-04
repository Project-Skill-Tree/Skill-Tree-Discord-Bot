const {MessageAttachment} = require("discord.js");
const Canvas = require("canvas");
const {romanise} = require("./romanNumeralHelper");
const Skill = require("../objects/skill");
const {fillRoundRect, strokeRoundRect} = require("./UIHelper");
const {end} = require("cheerio/lib/api/traversing");
const Tree = require("../objects/tree");

const root = new Tree().root;
/**
 * Send tree image in the channel
 * @param channel - the channel to send the tree to
 */
exports.displayTree = async function(channel) {
  const reviewImage = new MessageAttachment(await getTree(root), "tree.png");

  return channel.send({files: [reviewImage]});
};

/**
 * Generate the tree
 * @return {Promise<Buffer>} buffer -
 */
async function getTree(root) {
  const pad = 20;
  const skillWidth = 100;
  const skillHeight = 40;
  const w = getWidth(root, skillWidth, pad);
  const h = getHeight(root, skillHeight, pad);
  console.log(`${w} ${h}`);
  const canvas = Canvas.createCanvas(w + pad*2, h + pad*2);
  const context = canvas.getContext("2d");

  //Canvas settings
  context.antialias = "default";
  context.quality = "nearest";
  context.imageSmoothingEnabled = false;
  context.font = "30px \"Akira\"";

  //background
  await draw(canvas, root, pad, w+pad, pad, skillWidth, skillHeight, pad);

  //return final buffer
  return canvas.toBuffer();
}

async function draw(canvas, root, startX, endX, y, skillWidth, skillHeight, pad) {
  const context = canvas.getContext("2d");
  context.fillStyle = "rgba(0,0,0,1.0)";
  fillRoundRect(context,
    startX + (endX - startX)*0.5 - skillWidth*0.5,
    y - skillHeight*0.5,
    skillWidth, skillHeight, 10);
  context.strokeStyle = "rgba(192, 23, 235,1.0)";
  strokeRoundRect(context,
    startX + (endX - startX)*0.5 - skillWidth*0.5,
    y - skillHeight*0.5,
    skillWidth, skillHeight, 10);
  context.fillStyle = "rgba(255,255,255,1.0)";
  context.font = "10px \"Akira\"";
  const title = `${root.title} ${romanise(root.level)}`;
  const metrics = context.measureText(title);
  const textWidth = metrics.width;
  const textHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
  context.fillText(title,
    startX + (endX - startX)*0.5 - textWidth*0.5,
    y + textHeight*0.5);

  const numChildren = root.children.length;
  let childStartPos = 0;
  for (let i = 0; i < numChildren; i++) {
    const childWidth = getWidth(root.children[i], skillWidth, pad);
    const childStartX = startX + childStartPos;
    const childEndX = startX + childStartPos + childWidth;
    draw(canvas, root.children[i],
      childStartX,
      childEndX,
      y + skillHeight + pad,
      skillWidth,
      skillHeight,
      pad);
    childStartPos += childWidth + pad;


    //Draw line to child
    context.fillStyle = "rgba(0,0,0,1.0)";
    context.lineWidth = 3;
    context.beginPath();
    context.moveTo(startX + (endX - startX)*0.5,
      y + skillHeight*0.5);
    context.lineTo(startX + (endX - startX)*0.5,
      y + skillHeight*0.5 + pad*0.5);
    context.stroke();

    context.beginPath();
    context.moveTo(startX + (endX - startX)*0.5,
      y + skillHeight*0.5 + pad*0.5);
    context.lineTo(childStartX + (childEndX - childStartX)*0.5,
      y + skillHeight*0.5 + pad*0.5);
    context.stroke();

    context.beginPath();
    context.moveTo(childStartX + (childEndX - childStartX)*0.5,
      y + skillHeight*0.5 + pad*0.5);
    context.lineTo(childStartX + (childEndX - childStartX)*0.5,
      y + skillHeight*0.5 + pad);
    context.stroke();

    context.lineWidth = 1;
  }
}

function getWidth(skill, skillWidth, pad) {
  let totalWidth = 0;
  for (let i = 0; i < skill.children.length; i++) {
    const width = getWidth(skill.children[i], skillWidth, pad);
    totalWidth += width;
    if (i > 0) {
      totalWidth += pad;
    }
  }
  if (skill.children.length === 0) {
    totalWidth = skillWidth;
  }
  return totalWidth;
}

function getHeight(skill, skillHeight, pad) {
  let maxHeight = 0;
  for (let i = 0; i < skill.children.length; i++) {
    const height = getHeight(skill.children[i], skillHeight, pad);
    maxHeight = Math.max(maxHeight, skillHeight + height + pad);
  }
  if (skill.children.length === 0) {
    maxHeight = skillHeight;
  }
  return maxHeight;
}