const axios = require("axios");
const {authErrMsg} = require("./authHelper");
const User = require("../objects/user");
const Skill = require("../objects/skill");
const Challenge = require("../objects/challenge");

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
exports.authUser = function(discordid, channel=null, callback) {
  axios
    .get(process.env.API_URL + "users/loginDiscord/", {
      headers: {
        api_key: getAPIKey(),
        discordid: discordid,
      }
    }).then(res => {
      authErrMsg(res.data.id, channel, callback);
    });
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
exports.createUser = function(discordid, character, difficulty, timezone, baselocation, callback) {
  axios
    .post(process.env.API_URL + "users/registerDiscord/",{
      discordid: discordid,
      character: character,
      difficulty: difficulty,
      baselocation: baselocation,
      timezone: timezone,
    }, {
      headers: {
        api_key: getAPIKey(),
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

exports.setUserLocation = function(userID, base, callback) {
  return axios
    .post(process.env.API_URL + "users/updateBaseLocation/", {
      id: userID,
      baselocation: base,
    },{
      headers: {
        api_key: getAPIKey()
      }
    }).then(()=>{
      callback();
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
        api_key: getAPIKey(),
        id: userID
      }
    }).then(res => {
      res.data.user["username"] = username;
      callback(User.create(res.data.user));
    }).catch(err => {
      console.log(err);
    });
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
exports.getUsersInTimezone = function(timezone, callback) {
  axios
    .get(process.env.API_URL + "users/getAllInTimezone/", {
      headers: {
        api_key: getAPIKey(),
        timezone: timezone,
      }
    }).then(res => {
      const users = res.data.users.map(u => User.create(u));
      callback(users);
    }).catch(err => {
      console.log(err);
    });
};

/**
 * Update users timezone by the timezone offset from GMT
 * @param userID
 * @param {number} timezoneoffset - hours difference to GMT (-14 to +12)
 */
exports.updateTimezone = function(userID, timezoneoffset, callback) {
  axios
    .post(process.env.API_URL + "users/updateTimezone", {
      id: userID,
      timezone: timezoneoffset
    },{
      headers: {
        api_key: getAPIKey()
      }
    }).then(()=>{
      callback();
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
    })
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

exports.getCompleted = function(userid, callback) {
  axios
    .get(process.env.API_URL + "users/getCompleted", {
      headers: {
        api_key: getAPIKey(),
        userid: userid,
      }
    }).then(res => {
      const skillsCompleted = res.data.skills.map(d => Skill.create(d));
      const challengesCompleted = res.data.challenges.map(d => Challenge.create(d));
      callback([].concat(skillsCompleted, challengesCompleted));
    });
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
