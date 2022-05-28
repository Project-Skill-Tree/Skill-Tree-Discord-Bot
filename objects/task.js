/**
 * Task Object
 */
const Skill = require("./skill");
const {getDaysBetweenDates} = require("../modules/dateHelper");

class Task {
  /**
   * @param id - taskID
   * @param skill - skill to reference
   * @param data - task data
   * @param startDate - task start date
   * @param completed - T/F if this task has completed
   * @constructor
   */
  constructor(id, skill, data, startDate, completed) {
    this.id = id;
    this.skill = skill;
    this.data = data;
    this.startDate = startDate;
    this.completed = completed;
  }

  isChecked(date) {
    const index = getDaysBetweenDates(this.startDate, date);
    const checked = this.data[index];
    return (checked == null) ? false : checked;
  }

  setChecked(checked, date) {
    const index = getDaysBetweenDates(this.startDate, date);
    this.data[index] = checked;
  }

  /**
   * Create Task object from json data
   * @param data - JSON data for the task
   * @return {Task}
   */
  static create(data) {
    return new Task(data._id, Skill.create(data.skillID), data.data, new Date(data.startDate), data.completed);
  }
}


module.exports = Task;

