/**
 * Calculate the required XP to level up given the user's level
 * @param level - Current level of the user
 * @returns {number} - XP required to level up
 */
exports.calcXP = function(level) {
  return 100 * (1.05^level);
};

/**
 * Calculate the total XP of a player given their level and current XP
 * @param level - Current level of the user
 * @param xp - Current xp
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
 * Get the character icon path for a given user level
 * @param level - Current level of the user
 * @returns {String} - Character path, relative to the character folder (e.g "Overseer.png")
 */
exports.getCharacter = function(level) {
  //TODO: Dynamically get profile for each level;
  if (level < 2) {
    return "acolyte.png";
  } else if (level < 5) {
    return "disciple.png";
  } else if (level < 8) {
    return "red_spartan.png";
  } else if (level < 14) {
    return "spartan.png";
  } else if (level < 20) {
    return "purple_adonis.png";
  } else if (level < 28) {
    return "maximus.png";
  } else if (level < 35) {
    return "gold_adonis.png";
  } else if (level < 50)  {
    return "overseer.png";
  }
  return "acolyte.png";
};