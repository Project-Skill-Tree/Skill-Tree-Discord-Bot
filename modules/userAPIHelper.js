const axios = require("axios");
const User = require("../objects/user");
const Skill = require("../objects/skill");
const Challenge = require("../objects/challenge");
const Unlocked = require("../objects/unlocked");
const Item = require("../objects/item");

/**
 * Get API authentication key
 */
function getAPIKey() {
  return process.env.API_KEY;
}

/**
 * Authorise the user, return callback value if they exist in the database,
 * display an error message if the channel is defined and the user is not found
 * @param discordid - Discord ID
 * @param {?Channel=} channel - Channel to send error message in, if undefined, don't send
 * @param callback - Callback with param true/false for user found/not
 */
exports.authUser = async function(discordid) {
  const res = await axios
    .get(process.env.API_URL + "users/loginDiscord/", {
      headers: {
        api_key: getAPIKey(),
        discordid: discordid,
      }
    });
  return res.data.id;
};

/**
 * Create a user in the database
 * @param discordid
 * @param character
 * @param difficulty
 * @param timezone - timezone offset of the user
 * @param baselocation
 * @param callback - Callback with param true/false for user found/not
 */
exports.createUser = async function(discordid, character, difficulty, timezone, baselocation) {
  const res = await axios
    .post(process.env.API_URL + "users/registerDiscord/", {
      discordid: discordid,
      character: character,
      difficulty: difficulty,
      baselocation: baselocation,
      timezone: timezone,
    }, {
      headers: {
        api_key: getAPIKey(),
      }
    });
  return res.data.items.map(i => new Unlocked(Item.create(i)));
};

/**
 * Updating a user in the database
 * @param userID
 * @param character
 * @param timezone - timezone offset of the user
 * @param baselocation
 **/
exports.updateUser = function(userID, character, timezone, baselocation) {
  return axios
    .post(process.env.API_URL + "users/updateUser/", {
      userid: userID,
      character:character,
      timezone: timezone,
      baselocation: baselocation,
    },{
      headers: {
        api_key: getAPIKey()
      }
    });
};

/**
 * Updating a user in the database
 * @param userID
 **/
exports.deleteUser = function(userID) {
  return axios
    .post(process.env.API_URL + "users/deleteUser/", {
      userid: userID,
    },{
      headers: {
        api_key: getAPIKey()
      }
    });
};

exports.setUserLocation = async function(userID, base) {
  return await axios
    .post(process.env.API_URL + "users/updateBaseLocation/", {
      id: userID,
      baselocation: base,
    },{
      headers: {
        api_key: getAPIKey()
      }
    });
};

/**
 * Get JSON object for user given discord ID
 * @param userID - mongoDB userID
 * @param username - discord username
 * @param callback - method to pass user object to
 */
exports.getUser = async function(userID, username) {
  const res = await axios
    .get(process.env.API_URL + "users/profile/", {
      headers: {
        api_key: getAPIKey(),
        id: userID
      }
    });
  res.data.user["username"] = username;
  return User.create(res.data.user);
};

/**
 * Get all users
 * @param callback - method to pass user object to
 */
exports.getUsers = function(callback) {
  axios
    .get(process.env.API_URL + "users/getAll/", {
      headers: {
        api_key: getAPIKey(),
      }
    }).then(res => {
      const users = res.data.users.map(u => User.create(u));
      callback(users);
    }).catch(err => {
      console.log(err);
    });
};

/**
 * Get list of users within a given timezone
 * @param timezone - timezone offset of the user
 * @param callback - method to pass user object to
 */
exports.getUsersInTimezone = async function(timezone) {
  const res = await axios
    .get(process.env.API_URL + "users/getAllInTimezone/", {
      headers: {
        api_key: getAPIKey(),
        timezone: timezone,
      }
    });
  return res.data.users.map(u => User.create(u));
};

/**
 * Update users timezone by the timezone offset from GMT
 * @param userID
 * @param {number} timezoneoffset - hours difference to GMT (-14 to +12)
 */
exports.updateTimezone = async function(userID, timezoneoffset) {
  return await axios
    .post(process.env.API_URL + "users/updateTimezone", {
      id: userID,
      timezone: timezoneoffset
    },{
      headers: {
        api_key: getAPIKey()
      }
    });
};

/**
 *
 * @param userid - the discord ID of the user
 * @param xp - amount of xp to add
 */
exports.addXP = function(userid, xp) {
  return axios
    .post(process.env.API_URL + "users/addXP", {
      xp: xp,
      userid: userid
    },{
      headers: {
        api_key: getAPIKey()
      }
    });
};

/**
 * @param userid - the discord ID of the user
 * @param xp - amount of xp to add
 */
exports.updateXPHistory = function(userid, xp) {
  return axios
    .post(process.env.API_URL + "users/updateXPHistory", {
      id: userid,
      xp: xp,
    },{
      headers: {
        api_key: getAPIKey()
      }
    });
};

exports.getCompleted = async function(userid) {
  const res = await axios
    .get(process.env.API_URL + "users/getCompleted", {
      headers: {
        api_key: getAPIKey(),
        userid: userid,
      }
    });
  const skillsCompleted = res.data.skills.map(d => Skill.create(d));
  const challengesCompleted = res.data.challenges.map(d => Challenge.create(d));
  return [].concat(skillsCompleted, challengesCompleted);

};

exports.eraseCompleted = function(userid, toErase) {
  return axios
    .post(process.env.API_URL + "users/eraseCompleted", {
      userid: userid,
      toerase: toErase.id,
    }, {
      headers: {
        api_key: getAPIKey(),
      }
    });
};
