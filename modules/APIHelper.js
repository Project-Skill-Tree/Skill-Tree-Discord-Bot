const axios = require("axios");


/*
  .then(res => {
      console.log(`statusCode: ${res.status}`);
      return res;
    })
    .catch(error => {
      console.error(error);
    });
 */

function getKey() {
  return process.env.API_KEY;
}

module.exports = function getSkills() {
  return axios
    .get(process.env.API_URL + "/v1/skills/", {
      headers: {
        api_key: getKey() //the token is a variable which holds the token
      }
    });
};


module.exports = function getSkill(id) {
  return axios
    .get(process.env.API_URL + "/v1/skills/?id="+id)
    .then(res => {
      console.log(`statusCode: ${res.status}`);
      return res;
    });
};

module.exports = function resetTree(root, parent=null) {
  return axios
    .post(process.env.API_URL + "/v1/skills")
    .then(res => {
      console.log(`statusCode: ${res.status}`);
      return res;
    });
};