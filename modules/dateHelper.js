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
 * @param timezoneOffset
 * @return {Date} - date object
 */
exports.dayToDate = function(day, timezoneOffset=null) {
  let date = new Date(Date.parse(new Date().toUTCString()));
  if (timezoneOffset != null) {
    date = new Date(date.getTime() + timezoneOffset*3600000);
  }
  if (day === "today") {
    return date;
  } else if (day === "yesterday") {
    date.setUTCDate(date.getUTCDate() - 1);
    return date;
  } else if (day === "tomorrow") {
    date.setUTCDate(date.getUTCDate() + 1);
    return date;
  }
  return date;
};

/**
 * Gets a date in absolute number of days since Jan 1st 1970
 * @param {Date} d0
 * @return {number}
 */
exports.getAbsDate = function(d0) {
  const msPerDay = 8.64e7;
  const x0 = new Date(d0);
  x0.setHours(12,0,0);
  return Math.round( x0 / msPerDay );
};

/**
   Get the number of days between two dates - not inclusive.

   "between" does not include the start date, so days
   between Thursday and Friday is one, Thursday to Saturday
   is two, and so on. Between Friday and the following Friday is 7.

   e.g. getDaysBetweenDates( 22-Jul-2011, 29-jul-2011) => 7.

   If want inclusive dates (e.g. leave from 1/1/2011 to 30/1/2011),
   use date prior to start date (i.e. 31/12/2010 to 30/1/2011).

   Only calculates whole days.

   Assumes d0 <= d1
*/
exports.getDaysBetweenDates = function(d0, d1, tz) {

  const msPerDay = 8.64e7;

  // Copy dates so don't mess them up
  const x0 = new Date(d0);
  const x1 = new Date(d1);

  // Set to noon - avoid DST errors
  x0.setUTCHours(12+tz,0,0);
  x1.setUTCHours(12+tz,0,0);

  // Round to remove daylight saving errors
  return Math.round( (x1 - x0) / msPerDay );
};

exports.dateAsTime = function(date) {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? "0"+minutes : minutes;
  return hours + ":" + minutes + ampm;
};


exports.intervalToInt = function(interval) {
  switch (interval) {
    case "day":
      return 1;
    case "week":
      return 7;
    case "month":
      return 30;
    case "year":
      return 365;
    case "N/A":
      return -1;
  }
};