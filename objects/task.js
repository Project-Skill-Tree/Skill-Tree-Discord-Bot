const Skill = require("./skill");
const {getDaysBetweenDates, intervalToInt} = require("../modules/dateHelper");
const Challenge = require("./challenge");

/**
 * Task Object
 */
class Task {
  /**
   * @param id - taskID
   * @param child - the child object of this task (skill or challenge)
   * @param data - task data
   * @param startDate - task start date
   * @param completed - T/F if this task has completed
   * @constructor
   */
  constructor(id, child, data, startDate, completed) {
    this.id = id;
    this.child = child;
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
    const index = getDaysBetweenDates(this.startDate, date);
    const checked = this.data[index];
    return checked ? checked : false;
  }

  /**
   * Sets the task check state for a given day
   * handles dates outside the data range
   * @param checked - true/false ischecked value to set
   * @param {Date} date - date to query
   * @return {boolean|*}
   */
  setChecked(checked, date) {
    const index = Math.abs(getDaysBetweenDates(this.startDate, date));
    this.data[index] = checked;
    //Write all nonexistant data as false
    for (let i = 0; i < this.data.length; i++) {
      if (this.data[i] === undefined) {
        this.data[i] = false;
      }
    }
  }

  /**
   * Returns the percentage of checked tasks
   * @return {string}
   */
  percentChecked(date) {
    //Set current value in case there was a long gap between tasks
    //Data only stores the most recent set, so we need to set the current date to
    //the value at isChecked true if true, false if false, and false if not found.
    //That sets the length to the correct value to calculate the percentage
    this.setChecked(this.isChecked(date), date);
    let data;
    if (this.child instanceof Skill) {
      data = [...this.data]; //only check the last <timelimit> days
      data = data.splice(-this.child.timelimit);
    } else { //challenge has no time limit
      data = this.data;
    }
    return `${Math.round(100 * data.filter(Boolean).length / data.length)}%`;
  }

  numCheckedInInterval(date) {
    //Set current value in case there was a long gap between tasks
    //Data only stores the most recent set, so we need to set the current date to
    //the value at isChecked true if true, false if false, and false if not found.
    //That sets the length to the correct value to calculate the percentage
    this.setChecked(this.isChecked(date), date);
    let data;
    const interval = intervalToInt(this.child.interval);
    const frequency = this.child.frequency;
    if (this.child instanceof Skill) {
      data = [...this.data]; //only check the last <timelimit> days
      data = data.splice(-interval);
    } else { //challenge has no time limit
      data = this.data;
    }
    return `${data.length}/${frequency}`;
  }

  daysLeftInterval(date) {
    //Set current value in case there was a long gap between tasks
    //Data only stores the most recent set, so we need to set the current date to
    //the value at isChecked true if true, false if false, and false if not found.
    //That sets the length to the correct value to calculate the percentage
    this.setChecked(this.isChecked(date), date);

    //Split goals into equal sections covering the time limit for the given frequency
    const blockSize = ((this.child.frequency / intervalToInt(this.child.interval)) * this.child.timelimit) / this.child.goals.length;
    const curIntervalLength = this.data.length - Math.floor(this.data.length / blockSize) * blockSize;
    const daysLeft = intervalToInt(this.child.interval) - curIntervalLength;


    return `${daysLeft} day(s) left`;
  }

  /**
   * Create Task object from json data
   * @param data - JSON data for the task
   * @return {Task}
   */
  static create(data) {
    let child;
    if (data.skillID) {
      child = Skill.create(data.skillID);
    } else {
      child = Challenge.create(data.challengeID);
    }
    return new Task(data._id, child, data.data, new Date(data.startDate), data.completed);
  }
}


module.exports = Task;

