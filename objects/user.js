/**
 * User object
 */
class User {
  /**
   * User constructor
   * @param id
   * @param discordid - discordid of the user
   * @param name - Username
   * @param level - Level of the user
   * @param xp - total XP of the player
   * @param xpHistory - Weekly XP History of the player
   * @param skillscompleted - all completed skills
   * @param skillsinprogress - current skill
   * @param items - collected items
   * @param numDaysTracked - number of days tracked
   * @param reminderChannel - user's reminder channel
   * @param timezone - timezone command
   * @param baselocation
   * @constructor
   */
  constructor(id, discordid, name, level, xp, xpHistory, skillscompleted, skillsinprogress,
    items, numDaysTracked, reminderChannel, timezone, baselocation) {
    this.id = id;
    this.discordid = discordid;
    this.name = name;
    this.level = level;
    this.xp = xp;
    this.xpHistory = xpHistory;
    this.skillscompleted = skillscompleted;
    this.skillsinprogress = skillsinprogress;
    this.items = items;
    this.numDaysTracked = numDaysTracked;
    this.reminderChannel = reminderChannel;
    this.timezone = timezone;
    this.baselocation = baselocation;
  }

  /**
   * Create User object from JSON data
   * @return {User}
   * @param user
   */
  static create(user) {
    return new User(user._id, user.discordid, user.username, user.level, user.xp, user.xpHistory,
      user.skillscompleted, user.skillsinprogress, user.items,
      user.numDaysTracked, user.reminderChannel, user.timezone,
      user.baselocation);
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
