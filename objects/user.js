/**
 * User object
 */
class User {
  /**
   * User constructor
   * @constructor
   * @param name - Username
   * @param level - Level of the user
   * @param xp - current XP of the player. XP is not counted continuously, it's reset to 0 when the user levels up
   * @param skills - list of skills the user has completed
   * @param items - collected items
   */
  constructor(name, level, xp, skills, items) {
    this.name = name;
    this.level = level;
    this.xp = xp;
    this.skills = skills;
    this.items = items;
  }

  static create(data) {
    const user = data.user;
    const items = data.items;
    return new User(user.username, user.level, user.xp, user.skillscompleted, items);
  }
}

module.exports = User;
