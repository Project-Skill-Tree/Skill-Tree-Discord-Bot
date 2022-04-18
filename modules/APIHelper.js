const axios = require("axios");


function getKey() {
  return process.env.API_KEY;
}

/**
 * Get JSON object containing skills from database
 * @return {Promise<AxiosResponse<any>>}
 * @module APIHelper
 */
module.exports = function getSkills() {
  return axios
    .get(process.env.API_URL + "/v1/skills/", {
      headers: {
        api_key: getKey() //the token is a variable which holds the token
      }
    });
};

/**
 * Get the JSON object for a skill with a given id from the database
 * @param {string} id - The ObjectID of the skill to be requested
 * @return {Promise<AxiosResponse<any>>}
 * @module APIHelper
 */
module.exports = function getSkill(id) {
  return axios
    .get(process.env.API_URL + "/v1/skills/?id="+id)
    .then(res => {
      console.log(`statusCode: ${res.status}`);
      return res;
    });
};
