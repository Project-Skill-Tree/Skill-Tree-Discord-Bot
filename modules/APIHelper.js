const axios = require("axios");
const Skill = require("../objects/skill");
const User = require("../objects/user");
const Task = require("../objects/task");
const {authErrMsg} = require("./authHelper");

/** @module APIHelper */

/**
 * Get API authentication key
 */
function getKey() {
  return process.env.API_KEY;
}

/**
 * Authorise the user, return callback value if they exist in the database,
 * display an error message if the channel is defined and the user is not found
 * @param discordid - Discord ID
 * @param {?Channel=} channel - Channel to send error message in, if undefined, don't send
 * @param callback - Callback with param true/false for user found/not
 */
exports.authUser = function(discordid, channel=null, callback) {
  axios
    .get(process.env.API_URL + "users/loginDiscord/", {
      headers: {
        api_key: getKey(),
        discordid: discordid,
      }
    }).then(res => {
      authErrMsg(res.data.id, channel, callback);
    });
};

/**
 * Create a user in the database
 * @param discordid
 * @param gender
 * @param difficulty
 * @param dms_enabled
 * @param callback - Callback with param true/false for user found/not
 */
exports.createUser = function(discordid, gender, difficulty, dms_enabled, callback) {
  axios
    .post(process.env.API_URL + "users/registerDiscord/",{
      discordid: discordid,
      gender: gender,
      difficulty: difficulty,
      dms_enabled:dms_enabled}, {
      headers: {
        api_key: getKey(),
      }
    }).then(res => {
      if (res.data.userFound) {
        callback();
      }
    });
};

/**
 * Updating a user in the database
 * @param userID
 * @param gender
 * @param difficulty
 * @param dms_enabled
 **/
exports.updateUser =function(userID, gender, difficulty, dms_enabled) {
  return axios
    .post(process.env.API_URL + "users/updateUser/", {
      userid: userID,
      gender:gender,
      difficulty: difficulty,
      dms_enabled: dms_enabled
    },{
      headers: {
        api_key: getKey()
      }
    });
};

/**
 * Get JSON object for user given discord ID
 * @param userID - mongoDB userID
 * @param username - discord username
 * @param callback - method to pass user object to
 */
exports.getUser = function(userID, username, callback) {
  axios
    .get(process.env.API_URL + "users/profile/", {
      headers: {
        api_key: getKey(),
        id: userID
      }
    }).then(res => {
      res.data.user["username"] = username;
      callback(User.create(username, res.data));
    }).catch(err => {
      console.log(err);
    });
};

/**
 * Get JSON object containing skills from database
 * @param callback - Callback with list of skill objects
 */
exports.getSkills = function(callback) {
  axios.get(process.env.API_URL + "skills", {
    headers: {
      api_key: getKey()
    }
  }).then(res => {
    const skills = res.data.map(data => Skill.create(data));
    callback(skills);
  }).catch(res => {
    console.log(`Error fetching skills: ${res.status}`);
  });
};

/**
 * Get JSON object containing tasks that the user has accepted from the database
 * @param userID - MongoDB userID
 * @param callback - list of task objects
 */
exports.getCurrentTasks = function(userID,callback) {
  axios.get(process.env.API_URL + "tasks/currentTasks", {
    headers: {
      userid: userID,
      api_key: getKey()
    }
  }).then((res)=>{
    const tasks = res.data.map(data => Task.create(data));
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
      api_key: getKey(),
      limit: limit
    }
  }).then((res)=>{
    const tasks = res.data.map(data => Task.create(data));
    callback(tasks);
  }).catch(res => {
    console.log(res);
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
      api_key: getKey()
    }
  }).then((res)=>{
    const skills = res.data.map(data => Skill.create(data));
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
      api_key: getKey()
    }
  }).then(res => {
    const skills = res.data.map(data => Skill.create(data));
    callback(skills);
  }).catch(res => {
    console.log(`Error fetching skills: ${res.status}`);
  });
};

/**
 * Get the JSON object for a skill with a given id from the database
 * @param {string} skillID - SkillID
 * @param callback - Called with JSON parameter for skill object/null
 * @returns Skill or Null
 */
exports.getSkill = function(skillID, callback) {
  axios
    .get(process.env.API_URL + "skills/?id="+skillID, {
      headers: {
        api_key: getKey()
      }
    }).then(res => {
      callback(Skill.create(res.data));
    }).catch(() => {
      callback(null);
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
      id: userID,
      skillid: skillID
    },{
      headers: {
        api_key: getKey()
      }
    });
};

/**
 * Sets the completed state of a user's skill task for a given date
 * @param userid - userID
 * @param task
 * @param date - "today" or "yesterday"
 * @param checked - T/F if checked/unchecked
 */
exports.updateTask = function(userid, task, date, checked) {
  axios
    .post(process.env.API_URL + "tasks/updateTask", {
      userid: userid,
      taskid: task.id,
      checked: checked,
      date: date
    },{
      headers: {
        api_key: getKey()
      }
    });
};

/**
 *
 * @param xp - amount of xp to add
 * @param discordid - the discord ID of the user
 */
exports.addXP = function(xp, discordid) {
  return axios
    .post(process.env.API_URL + "users/addXP", {
      xp: parseInt(xp),
      discordid: discordid
    },{
      headers: {
        api_key: getKey()
      }
    }).then(res => {
      console.log(res);
    });
};