/** @module AuthHelper */

/**
 * Displays an error message if the user is not found
 * @param {?Boolean} id - null or userID value
 * @param channel - channel to send warn message
 * @param callback - function to run if the user exists
 */
exports.authErrMsg = function(id, channel, callback) {
  if (channel == null) {
    callback(id);
  } else {
    if (!id) {
      channel.send("```Error: Please create an account with ~setup```");
    } else {
      callback(id);
    }
  }
};