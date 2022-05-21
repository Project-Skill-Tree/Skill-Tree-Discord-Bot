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

/**
 * Formats a written day nem into a date object
 * Today -> new Date()
 * Yesterday -> new Date() - 1
 * @param day - written day [yesterday, today, tomorrow]
 * @return {Date} - date object
 */
exports.dayToDate = function(day) {
  if (day === "today") {
    return new Date();
  } else if (day === "yesterday") {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday;
  } else if (day === "tomorrow") {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() + 1);
    return yesterday;
  }
  return new Date();
};
