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

async function getSkills() {
  return await axios
    .get(process.env.API_URL + "/v1/skills", {
      headers: {
        api_key: getKey() //the token is a variable which holds the token
      }
    })
};


async function getSkill(id) {
  return await axios.get(process.env.API_URL + `/v1/skills/?id=${id}`);
};

async function resetTree(root, parent=null) {
  return await axios
    .post(process.env.API_URL + "/v1/skills");
};

module.exports = {
  resetTree,
  getSkill,
  getSkills,
}
