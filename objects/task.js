/**
 * Task Object
 */
class Task {
  /**
   * @param id - taskID
   * @param skill - skill to reference
   * @param data - task data
   * @constructor
   */
  constructor(id, skill, data) {
    this.id = id;
    this.skill = skill;
    this.data = data;
  }
}


module.exports = Task;

