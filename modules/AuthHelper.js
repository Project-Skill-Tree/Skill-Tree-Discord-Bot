/** @module AuthHelper */

/**
 * Displays an error message if the user is not found
 * @param {Boolean} userExists - T/F depending on if the user is registered
 * @param channel - channel to send warn message
 * @param callback - function to run if the user exists
 */
exports.authErrMsg = function(userExists, channel, callback) {
  if (!userExists) {
    channel.send("```Error: Please create an account with ~setup```");
  } else {
    callback();
  }
};