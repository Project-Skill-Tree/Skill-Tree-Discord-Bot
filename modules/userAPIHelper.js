const axios = require("axios");
const {authErrMsg} = require("./authHelper");
const User = require("../objects/user");

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
 * @param gender
 * @param difficulty
 * @param dms_enabled
 * @param timezone - timezone offset of the user
 * @param callback - Callback with param true/false for user found/not
 */
exports.createUser = function(discordid, gender, difficulty, dms_enabled, timezone, callback) {
  axios
    .post(process.env.API_URL + "users/registerDiscord/",{
      discordid: discordid,
      gender: gender,
      difficulty: difficulty,
      dms_enabled:dms_enabled,
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
 * @param gender
 * @param difficulty
 * @param dms_enabled
 * @param timezone - timezone offset of the user
 **/
exports.updateUser = function(userID, gender, difficulty, dms_enabled, timezone) {
  return axios
    .post(process.env.API_URL + "users/updateUser/", {
      userid: userID,
      gender:gender,
      difficulty: difficulty,
      dms_enabled: dms_enabled,
      timezone: timezone,
    },{
      headers: {
        api_key: getAPIKey()
      }
    });
};

exports.setUserLocation = function(userID, base) {
  return axios
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
 * @param timezone - timezone offset of the user
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
exports.updateTimezone = function(userID, timezoneoffset) {
  axios
    .post(process.env.API_URL + "user/updateTimezone", {
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
    }).then(res => {
      console.log(res);
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
