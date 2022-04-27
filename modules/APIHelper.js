const axios = require("axios");
const Skill = require("../objects/skill");
/** @module APIHelper */

function getKey() {
  return process.env.API_KEY;
}

/**
 * Get JSON object containing skills from database
 * @param {String} discordid - discordid of the user
 * @return {Promise<AxiosResponse<any>>}
 * @exports getSkills
 */
exports.createAccount = function(discordid) {
  return axios
    .post(process.env.API_URL + "users/register", {
      headers: {
        discordid: discordid,
        api_key: getKey()
      }
    });
};

/**
 * Get JSON object containing skills from database
 * @return {Promise<AxiosResponse<any>>}
 * @exports getSkills
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
 * Get the JSON object for a skill with a given id from the database
 * @param {string} id - The ObjectID of the skill to be requested
 * @returns Skill or Null
 */
exports.getSkill = function(id) {
  axios
    .get(process.env.API_URL + "skills/?id="+id, {
      headers: {
        api_key: getKey()
      }
    }).then(res => {
      console.log(`statusCode: ${res.status}`);
      return Skill.create(res.data);
    }).catch(() => {
      return null;
    });
};

/**
 * Adds the skill to the users active skills
 * @param id - discord id of the user
 * @param title - title of the skill to start
 * @param level - level of the skill to start
 * @return {Promise<AxiosResponse<any>>}
 */
exports.startSkill = function(id, title, level) {
  return axios
    .post(process.env.API_URL + "startSkill", {
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
exports.updateTask = function(id, task, date) {
  return axios
    .post(process.env.API_URL + "trackSkill", {
      discordid: id,
      taskid: task.id,
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
    .get(process.env.API_URL + "currentTasks", {
      headers: {
        api_key: getKey(),
        discordid: id,
        date: date,
      }
    });
};