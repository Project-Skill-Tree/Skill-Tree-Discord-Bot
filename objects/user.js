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
   * @param numDaysTracked - number of days tracked
   * @constructor
   */
  constructor(name, level, xp, xpHistory, skillscompleted, skillsinprogress, items, numDaysTracked) {
    this.name = name;
    this.level = level;
    this.xp = xp;
    this.xpHistory = xpHistory;
    this.skillscompleted = skillscompleted;
    this.skillsinprogress = skillsinprogress;
    this.items = items;
    this.numDaysTracked = numDaysTracked;
  }

  /**
   * Create User object from JSON data
   * @param username - discord username of this user
   * @param data - JSON data for the user
   * @return {User}
   */
  static create(data) {
    const user = data.user;
    const items = data.items;
    return new User(user.username, user.level, user.xp, user.xpHistory,
      user.skillscompleted, user.skillsinprogress, items, user.numDaysTracked);
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
