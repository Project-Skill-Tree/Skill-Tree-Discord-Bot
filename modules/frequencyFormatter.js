module.exports = function formatFrequency(frequency, interval) {
  let timesString;

  if(frequency > 1) {
    switch(interval) {
      case "day":
        timesString = `${frequency} times a day`;
        break;
      
      case "week":
        timesString = `${frequency} times a week`;
        break;

      case "month":
        timesString = `${frequency} times a week`;
        break;

      case "year":
        timesString = `${frequency} times a year`;
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
