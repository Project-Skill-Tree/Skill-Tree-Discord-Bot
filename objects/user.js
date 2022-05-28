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
   * @param skillsinprogress - current skill
   * @param items - collected items
   */
  constructor(name, level, xp, skills, skillsinprogress, items) {
    this.name = name;
    this.level = level;
    this.xp = xp;
    this.skills = skills;
    this.skillsinprogress = skillsinprogress;
    this.items = items;
  }

  static create(data) {
    const user = data.user;
    const items = data.items;
    return new User(user.name, user.level, user.xp, user.skillscompleted, user.skillsinprogress, items);
  }
}

module.exports = User;
