/**
 * User object
 */
class User {
  /**
   * User constructor
   * @param name - Username
   * @param level - Level of the user
   * @param xp - total XP of the player
   * @param xpHistory - Weekly XP History of the player
   * @param skills - list of skills the user has completed
   * @param skillsinprogress - current skill
   * @param items - collected items
   * @constructor
   */
  constructor(name, level, xp, xpHistory, skills, skillsinprogress, items) {
    this.name = name;
    this.level = level;
    this.xp = xp;
    this.xpHistory = xpHistory;
    this.skills = skills;
    this.skillsinprogress = skillsinprogress;
    this.items = items;
  }

  /**
   * Create User object from JSON data
   * @param username - discord username of this user
   * @param data - JSON data for the user
   * @return {User}
   */
  static create(username, data) {
    const user = data.user;
    const items = data.items;
    return new User(username, user.level, user.xp, user.xpHistory, user.skillscompleted, user.skillsinprogress, items);
  }

  getPrevXP() {
    const prevXP = this.xpHistory.splice(-1);
    if (prevXP === undefined) {
      return 0;
    }
    return prevXP;
  }
}

module.exports = User;
