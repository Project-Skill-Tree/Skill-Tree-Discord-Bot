module.exports = function formatFrequency(frequency, interval) {
  let timesString;

  if(frequency > 1) {
    switch(interval) {
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
    switch(interval) {
      case "day":
        timesString = "daily";
        break;
      
      case "week":
        timesString = "weekly";
        break;

      case "month":
        timesString = "monthly";
        break;

      case "year":
        timesString = "yearly";
        break;
    }
  }

  return timesString;
}
