const cron = require("node-cron");
const {getRecentTasks} = require("../modules/skillAPIHelper");
const {displayReview} = require("../modules/weeklyReviewRenderer");
const {getUsersInTimezone} = require("../modules/userAPIHelper");
const {getBaseLocation} = require("../modules/baseHelper");

exports.run = (client) => {
  //Schedule a job every sunday
  cron.schedule("*/30 0-23 * * 0,1,2", async function() {
    const offset = getCurrentOffset();
    if (!offset) return;
    let users = await getUsersInTimezone(offset);
    //only get discord users
    users = users.filter(u => u.discordid);
    //exit if no users found
    if (users.length === 0) return;
    for (let i = 0; i < users.length; i++) {
      const user = users[i];

      //Get last 7 days worth of tasks
      const tasks = await getRecentTasks(user.id, 7);
      if (!user.baselocation) {
        //Attempt to send warning message if no base found
        const userDM = client.channels.cache.get(user.discordid);
        if (!userDM) return;
        userDM.send(
          "``` Your weekly report failed to send. " +
          "Please set a base location with the `base` command " +
          "to receive reminders and weekly messages.```");
        return;
      }
      const channel = await getBaseLocation(client, user.baselocation);
      if (!channel) return;
      await displayReview(user, channel, tasks);
    }
  });
};

function getCurrentOffset() {
  let offset;
  try {
    //Round time to the nearest 30 minutes
    const currentTime = new Date();
    currentTime.setUTCMinutes(Math.round(currentTime.getUTCMinutes() / 30) * 30);
    //Get the nearest sunday at 6:00:00
    const dayOfWeek = currentTime.getUTCDay();
    //day
    const list = [...Array(8).keys()].map(x => (x + 1) % 7);
    let dayDiff;
    if ( list.indexOf(dayOfWeek) < 4) {
      dayDiff = - list.indexOf(dayOfWeek);
    } else {
      dayDiff = 6 - list.indexOf(dayOfWeek);
    }
    const scheduledTime = new Date(currentTime.getTime());
    scheduledTime.setUTCHours(18,0,0);
    scheduledTime.setUTCDate(currentTime.getUTCDate() + dayDiff);

    //Add 5 days so it doesn't underflow below jan 1st 1970
    const timeDiff = new Date(10*60*60*1000*24 + scheduledTime.getTime() - currentTime.getTime());
    offset = timeDiff.getUTCHours() + Math.round(timeDiff.getUTCMinutes() / 30)*0.5;
  } catch (e) {
    console.log(e);
  }
  //only check valid offsets
  if (offset < -12 || offset > 14) {
    return null;
  }
  return offset;
}