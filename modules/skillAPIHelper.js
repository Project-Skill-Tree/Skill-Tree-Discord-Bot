const axios = require("axios");
const Skill = require("../objects/skill");
const Task = require("../objects/task");
const Item = require("../objects/item");
const Challenge = require("../objects/challenge");
const Unlocked = require("../objects/unlocked");

/** @module APIHelper */

/**
 * Get API authentication key
 */
function getAPIKey() {
  return process.env.API_KEY;
}

/**
 * Get JSON object containing tasks that the user has accepted from the database
 * @param userID - MongoDB userID
 * @param callback - list of task objects
 */
exports.getCurrentTasks = function(userID,callback) {
  axios.get(process.env.API_URL + "tasks/currentTasks", {
    headers: {
      userid: userID,
      api_key: getAPIKey()
    }
  }).then((res)=>{
    const tasks = res.data.tasks.map(data => Task.create(data));
    callback(tasks);
  }).catch(res => {
    console.log(res);
  });
};

/**
 * Get all tasks in the last <limit> days
 * @param userID- MongoDB userID
 * @param {number} limit - number of days ago for the last habit entry
 * @param callback
 */
exports.getRecentTasks = function(userID, limit, callback) {
  axios.get(process.env.API_URL + "tasks/recentTasks", {
    headers: {
      userid: userID,
      api_key: getAPIKey(),
      limit: limit
    }
  }).then((res)=>{
    const tasks = res.data.tasks.map(data => Task.create(data));
    callback(tasks);
  }).catch(res => {
    console.log(res);
  });
};

/**
 * find a task using its ID, and delete it.
 * @param {*} taskID - ID of the task to delete 
 */
exports.deleteTask = function(taskID) {
  axios.post(process.env.API_URL + "tasks/deleteTask", {
    taskid:taskID
  },{
    headers: {
      api_key: getAPIKey()
    }
  });
};

/**
 * Get JSON object containing skills that the user has accepted from the database
 * @param userID - MongoDB userID
 * @param callback - return JSON data of skills in progress
 */
exports.getSkillsInProgress = function(userID, callback) {
  axios.get(process.env.API_URL + "skills/inProgress", {
    headers: {
      userid: userID,
      api_key: getAPIKey()
    }
  }).then((res)=>{
    const skills = res.data.skills.map(data => Skill.create(data));
    callback(skills);
  }).catch(res => {
    console.log(res);
  });
};


/**
 * Get JSON object containing skills available to a given user from database
 * @param userID - MongoDB userID
 * @param callback - function to run, passes list of skills
 */
exports.getAvailableSkills = function(userID, callback) {
  axios.get(process.env.API_URL + "skills/available", {
    headers: {
      id: userID,
      api_key: getAPIKey()
    }
  }).then(res => {
    const skills = res.data.skills.map(data => Skill.create(data));
    callback(skills);
  }).catch(res => {
    console.log(`Error fetching skills: ${res.status}`);
  });
};


/**
 * Get JSON object containing skills in the given list
 * @param skills - List of MongoDB skills IDs
 * @param callback - return JSON data of skills in progress
 */
exports.getSkillsInList = function(skills, callback) {
  axios.get(process.env.API_URL + "skills/getAllInList", {
    headers: {
      api_key: getAPIKey(),
      skills: skills,
    }
  }).then((res)=>{
    const skills = res.data.skills.map(data => Skill.create(data));
    callback(skills);
  }).catch(res => {
    console.log(res);
  });
};

/**
 * Adds the skill to the users active skills
 * @param userID - userID
 * @param skillID - skillID of the skill to start
 */
exports.startSkill = function(userID, skillID) {
  axios
    .post(process.env.API_URL + "skills/startSkill", {
      userid: userID,
      skillid: skillID
    },{
      headers: {
        api_key: getAPIKey()
      }
    });
};

/**
 * skips the skill to the next skill in the branch
 * @param userID - userID
 * @param skillID - skillID of the skill to start
 */
exports.skipSkill = function(userID, skillID) {
  axios
    .post(process.env.API_URL + "skills/skipSkill", {
      userid: userID,
      skillid: skillID
    },{
      headers: {
        api_key: getAPIKey()
      }
    });
};

/**
 * Goes to the previous skill in the branch
 * @param userID - userID
 * @param skillID - skillID of the skill to start
 */
exports.revertSkill = function(userID, skillID) {
  axios
    .post(process.env.API_URL + "skills/revertSkill", {
      userid: userID,
      skillid: skillID
    },{
      headers: {
        api_key: getAPIKey()
      }
    });
};

/**
 * Cancels a given skill
 * @param  userID
 * @param skillID
 */
exports.cancelSkill = function(userID,skillID) {
  axios
    .post(process.env.API_URL + "skills/cancelSkill", {
      userid: userID,
      skillid: skillID
    },{
      headers: {
        api_key: getAPIKey()
      }
    });
};

/**
 * Sets the completed state of a user's skill task for a given date
 * @param userid - userID
 * @param task
 * @param day
 * @param checked - T/F if checked/unchecked
 * @param callback - function to execute on completion
 */
exports.updateTask = function(userid, task, day, checked, callback) {
  axios
    .post(process.env.API_URL + "tasks/updateTask", {
      userid: userid,
      taskid: task.id,
      checked: checked,
      day: day
    },{
      headers: {
        api_key: getAPIKey()
      }
    }).then((res)=>{
      if (res.data.unlocked.length === 0 || !res.data.unlocked.map) return;

      const levelUp = res.data.levelUp;
      const unlocked = res.data.unlocked.map(val => {
        switch (val.type) {
          case "Skill":
            return new Unlocked(Skill.create(val));
          case "Item":
            return new Unlocked(Item.create(val));
          case "Challenge":
            return new Unlocked(Challenge.create(val));
        }
      });
      callback(levelUp, unlocked);
    });
};
