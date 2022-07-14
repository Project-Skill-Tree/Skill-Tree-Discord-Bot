const cron = require("node-cron");
const {getRecentTasks, getAllInList} = require("../modules/skillAPIHelper");
const {displayReview} = require("../modules/weeklyReviewRenderer");
const {getUsersInTimezone} = require("../modules/userAPIHelper");
const {getBaseLocation} = require("../modules/baseHelper");

exports.run = (client) => {
  // set cron to be GMT + 12
  cron.setTimezone("Etc/GMT+12");

  // run “At minute 0 past every hour from 0 through 23 on Sunday.”
  // https://crontab.guru/#0_0-23_*_*_0
  cron.schedule("0 0-23 * * 0", async () => {
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
