const Skill = require("./skill");
const {getDaysBetweenDates} = require("../modules/dateHelper");

/**
 * Task Object
 */
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

  /**
   * Returns true if this task has been checked off for a given date, false otherwise
   * handles dates outside the data range
   * @param {Date} date - date to query
   * @return {boolean|*}
   */
  isChecked(date) {
    console.log(getDaysBetweenDates(this.startDate, date));
    console.log(this.data);
    const index = getDaysBetweenDates(this.startDate, date);
    const checked = this.data[index];
    return (checked == null) ? false : checked;
  }

  /**
   * Sets the task check state for a given day
   * handles dates outside the data range
   * @param checked - true/false ischecked value to set
   * @param {Date} date - date to query
   * @return {boolean|*}
   */
  setChecked(checked, date) {
    const index = getDaysBetweenDates(this.startDate, date);
    this.data[index] = checked;
  }

  /**
   * Returns the percentage of checked tasks
   * @return {string}
   */
  percentChecked() {
    //Set current value in case there was a long gap between tasks
    //Data only stores the most recent set, so we need to set the current date to
    //the value at isChecked true if true, false if false, and false if not found.
    //That sets the length to the correct value to calculate the percentage
    const date = new Date();
    this.setChecked(this.isChecked(date), date);
    return `${Math.round(100 * this.data.filter(v => v).length / this.data.length)}%`;
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

