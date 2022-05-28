const Rank = require("../objects/rank");
/** @module XPHandler */

const ranks = [
  new Rank("Acolyte",-Number.MAX_VALUE,"rgb(52,152,219)", "character1.png"),
  new Rank("Spartan",10,"rgb(255, 100, 69)", "character2.png"),
  new Rank("Disciple",20,"rgb(75, 252, 252)", "character3.png"),
  new Rank("Warrior",40,"rgb(255,207,40)", "character4.png"),
  new Rank("Adonis",60,"rgb(161, 105, 231)", "character5.png"),
  new Rank("Maximus",80,"rgb(33,255,177)", "character6.png"),
];

/**
 * Calculate the required XP to level up given the user's level
 * @param {number} level - Current level of the user
 * @returns {number} - XP required to level up
 */
exports.calcXP = function(level) {
  return 50 * (1.02^level);
};

/**
 * Calculate the total XP of a player given their level and current XP
 * @param {number} level - Current level of the user
 * @param {number} xp - Current xp
 * @returns {number} - Total XP from level 0
 */
exports.calcTotalXP = function(level, xp) {
  let sum = 0;
  for (let i = 0; i < level; i++) {
    sum += this.calcXP(i);
  }
  sum += xp;
  return sum;
};

/**
 * Return the rank object with all the rank data for a user of a given level
 * @param {number} level - Current level of the user
 * @return {Rank} Rank object for this level
 */
exports.getRank = function(level) {
  for (let i = ranks.length-1; i > 0; i--) {
    if (level >= ranks[i].minLevel) {
      return ranks[i];
    }
  }
  return ranks[0];
};

/**
 * Get the rank colour from a user's level
 * @param {number} level - Current level of the user
 * @return {string} - Colour of the given rank
 */
exports.getColor = function(level) {
  return exports.getRank(level).color;
};

/**
 * Get the character icon path for a given user level
 * @param {number} level - Current level of the user
 * @returns {String} - Character image paht for the given rank
 */
exports.getCharacter = function(level) {
  return exports.getRank(level).character;
};