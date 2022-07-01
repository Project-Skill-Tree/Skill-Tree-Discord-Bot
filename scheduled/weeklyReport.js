const cron = require("node-cron");
const {getRecentTasks, getAllInList} = require("../modules/skillAPIHelper");
const {displayReview} = require("../modules/weeklyReviewRenderer");
const {getUsersInTimezone} = require("../modules/userAPIHelper");
const {getBaseLocation} = require("../modules/baseHelper");

exports.run = (client) => {
  //Schedule a job every sunday
  cron.schedule("0 0-24/30 * * 6,0,1", function() {
    const offset = getCurrentOffset();
    if (!offset) return;
    getUsersInTimezone(offset, (users)=>{
      //only get discord users
      users = users.filter(u => u.discordid);
      //exit if no users found
      if (users.length === 0) return;

      //Get unique skills/challenges from users as list
      const objIDs = Array.from(
        users
          .map(u => u.inprogress) //get skills from users
          .flat() //convert to one big list
          .reduce((set, e) => set.add(e), new Set()) //only unique items
      );
      getAllInList(objIDs, async (objs) => {
        //Map skills for indexing
        const IDMap = new Map(
          objs.map(obj => {
            return [obj.id, obj];
          }),
        );
        for (let i = 0; i < users.length; i++) {
          const user = users[i];

          //Get skill/challenge objects for user's inprogress
          user.inprogress = user.inprogress.map(s => IDMap.get(s.id));

          //Get last 7 days worth of tasks
          getRecentTasks(user.id, 7, async (tasks) => {
            if (!user.baselocation) {
              //Attempt to send warning message if no base found
              const userDM = client.channels.cache.get(user.id);
              if (!userDM) return;
              userDM.send(
                "``` Your weekly report failed to send. " +
                "Please set a base location with the `base` command " +
                "to receive reminders and weekly messages.```");
              return;
            }
            const channel = await getBaseLocation(client, user.baselocation);
            if (!channel) return;
            displayReview(user, channel, tasks);
          });
        }
      });
    });
  });
};

function getCurrentOffset() {
  let offset;
  try {
    //Round time to the nearest 30 minutes
    const currentTime = new Date();
    currentTime.setMinutes(Math.round(currentTime.getMinutes() / 30) * 30);
    //Get the nearest sunday at 6:00:00
    const dayOfWeek = currentTime.getDay();
    //day
    const dayDiff = dayOfWeek < 4 ? 0 - dayOfWeek : 7 - dayOfWeek;
    const scheduledTime = new Date(currentTime.getTime());
    scheduledTime.setHours(18,0,0);
    scheduledTime.setDate(currentTime.getDate() + dayDiff);

    //Add 5 days so it doesn't underflow below jan 1st 1970
    const timeDiff = new Date(10*60*60*1000*24 + scheduledTime.getTime() - currentTime.getTime());
    offset = timeDiff.getHours() + Math.round(timeDiff.getMinutes() / 30)*0.5;
  } catch (e) {
    console.log(e);
  }
  //only check valid offsets
  if (offset < -12 || offset > 14) {
    return null;
  }
  return offset;
}