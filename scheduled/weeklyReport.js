const cron = require("node-cron");
const {getRecentTasks} = require("../modules/skillAPIHelper");
const {displayReview} = require("../modules/weeklyReviewRenderer");
const {getUsersInTimezone, saveWeekly} = require("../modules/userAPIHelper");
const {getBaseLocation} = require("../modules/baseHelper");

/**
 * Sends a weekly report every sunday at 6PM in the user's local timezone
 * @param client
 */
exports.run = (client) => {
  //Schedule a repeating task every 30 minutes all day saturday, sunday, monday.
  cron.schedule("*/30 0-23 * * 6,0,1", async function() {
    //Get the timezone offset
    const offset = getCurrentOffset();
    //If not at sunday 6PM
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
      const discorduser = await client.users.fetch(user.discordid);
      user.username = discorduser.username;
      const channel = await getBaseLocation(client, user.baselocation);
      if (!channel) return;
      await saveWeekly(user.id);
      await displayReview(user, channel, tasks);
    }
  });
};

function getCurrentOffset() {
  // get time at GMT + 8
  const GMToffset = new Date().getTimezoneOffset();
  const GMTTime = new Date(new Date().getTime() + GMToffset * 60 * 1000);
  // get GMT+12 time and round it to nearest 30minutes
  const GMT12Time = new Date(new Date(GMTTime.getTime() + 12 * 60 * 60 * 1000) - new Date(GMTTime.getTime() + 12 * 60 * 60 * 1000).getTime() % (30 * 60 * 1000));

  // check it's between sunday 6pm and monday 8pm
  const inTime = (GMT12Time.getDay() === 0 && GMT12Time.getHours() >= 18) || (GMT12Time.getDay() === 1 && GMT12Time.getHours() <= 20);
  if (!inTime) {
    return null;
  }

  // get absolute time for last sunday 6pm for GMT time
  const lastSundayAbsoluteTime = new Date(
    GMT12Time.getFullYear(),
    GMT12Time.getMonth(),
    GMT12Time.getDate() - GMT12Time.getDay(),
    18,
    0,
    0
  ).getTime();

  const difference = (GMT12Time.getTime() - lastSundayAbsoluteTime)/(1000*60*60);

  // convert GMT+12 current time and GMT+12 sunday 6pm time to universal offset by subtracting the difference from 12
  // for example if it's 10PM at GMT+12 then it's been 4 hours since last sunday 6pm
  // 12 - 4 = 8
  // therefore we must get all users that have set their timezone to GMT+8

  return 12 - difference;
}