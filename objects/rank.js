/**
 * Rank Object
 * @param title - Title of the rank (E.G Acolyte, Overseer)
 * @param minLevel - The minimum level needed to attain this rank
 * @param color - the color of this rank
 * @param characterPath - The path (relative to "assets/characters/") of this rank
 * @returns {exports}
 */
class Rank {
  constructor(title, minLevel, color, characterPath) {
    this.title = title;
    this.minLevel = minLevel;
    this.color = color;
    this.character = characterPath;
  }
}

module.exports = Rank;
