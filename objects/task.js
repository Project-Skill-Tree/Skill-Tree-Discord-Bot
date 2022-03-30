/**
 * Task Object
 * @param skill - Skill object for linking the task to a skill
 * @param completed - Whether the task has been completed or not
 * @returns {exports}
 */
module.exports = class Task {
  constructor(skill, completed) {
    this.skill = skill;
    this.completed = completed;
  }
};

