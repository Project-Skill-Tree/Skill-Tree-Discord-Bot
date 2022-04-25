const axios = require("axios");
/** @module APIHelper */

function getKey() {
  return process.env.API_KEY;
}

/**
 * Get JSON object containing skills from database
 * @return {Promise<AxiosResponse<any>>}
 * @exports getSkills
 */
exports.getSkills = function() {
  return axios
    .get(process.env.API_URL + "/v1/skills/", {
      headers: {
        api_key: getKey()
      }
    });
};

/**
 * Get the JSON object for a skill with a given id from the database
 * @param {string} id - The ObjectID of the skill to be requested
 * @return {Promise<AxiosResponse<any>>}
 */
exports.getSkill = function(id) {
  return axios
    .get(process.env.API_URL + "/v1/skills/?id="+id, {
      headers: {
        api_key: getKey()
      }
    }).then(res => {
      console.log(`statusCode: ${res.status}`);
      return res;
    });
};

/**
 * Adds the skill to the users active skills
 * @param username - discord username of the user
 * @param title - title of the skill to start
 * @param level - level of the skill to start
 * @return {Promise<AxiosResponse<any>>}
 */
exports.startSkill = function(id, title, level) {
  return axios
    .post(process.env.API_URL + "/v1/startSkill/", {
      discordid: id,
      title: title,
      level: level,
    },{
      headers: {
        api_key: getKey()
      }
    });
};

/**
 * Sets the completed state of a user's skill task for a given date
 * @param id - discord username
 * @param task - task object to update
 * @param date - "today" or "yesterday"
 * @return {Promise<AxiosResponse<any>>}
 */
exports.trackSkill = function(id, task, date) {
  return axios
    .post(process.env.API_URL + "/v1/trackSkill/", {
      discordid: id,
      title: task.skill.title,
      level: task.skill.level,
      completed: task.completed,
      date: date
    },{
      headers: {
        api_key: getKey()
      }
    });
};

/**
 * Gets a users skills and returns them as task objects with "completed" field
 * @param id - discordID of the user
 * @param date - date of the tasks to get
 * @return {Promise<AxiosResponse<any>>}
 */
exports.getTasks = function(id, date) {
  return axios
    .get(process.env.API_URL + "/v1/currentTasks/", {
      headers: {
        discordid: id,
        date: date,
        api_key: getKey()
      }
    });
};