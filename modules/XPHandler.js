const Rank = require("../objects/rank");
/** @module XPHandler */

const ranks = [
  new Rank("Acolyte",-Number.MAX_VALUE,"rgb(52,152,219)", "acolyte.png"),
  new Rank("Spartan",5,"rgb(255, 100, 69)", "red_spartan.png"),
  new Rank("Disciple",8,"rgb(75, 252, 252)", "disciple.png"),
  new Rank("Warrior",14,"rgb(255,207,40)", "spartan.png"),
  new Rank("Adonis",20,"rgb(161, 105, 231)", "purple_adonis.png"),
  new Rank("Maximus",28,"rgb(33,255,177)", "maximus.png"),
  new Rank("Gold Adonis",35,"rgb(255,198,7)", "gold_adonis.png"),
  new Rank("Overseer",50,"rgb(253,84, 191)", "overseer.png"),
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