/** @module frequencyFormatter */

/**
 * Format the skill tracking frequency in a readable format (e.g. DAILY, WEEKLY, 2x/DAY, 5x/WEEK)
 * @param {number} frequency - number of times per interval
 * @param {string} interval - time interval for skills, e.g. day, week, month, year
 * @return {string}
 */
exports.formatFrequency = function(frequency, interval) {
  let timesString;

  if (frequency > 1) {
    switch (interval) {
      case "day":
        timesString = `${frequency}x/DAY`;
        break;
      
      case "week":
        timesString = `${frequency}x/WEEK`;
        break;

      case "month":
        timesString = `${frequency}x/MONTH`;
        break;

      case "year":
        timesString = `${frequency}x/YEAR`;
        break;
    }
  } else {
    switch (interval) {
      case "day":
        timesString = "DAILY";
        break;
      
      case "week":
        timesString = "WEEKLY";
        break;

      case "month":
        timesString = "MONTHLY";
        break;

      case "year":
        timesString = "YEARLY";
        break;
    }
  }
  return timesString;
};
