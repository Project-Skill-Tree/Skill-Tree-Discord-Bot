const cron = require("node-cron");
const { getRecentTasks, getAllInList } = require("../modules/skillAPIHelper");
const { displayReview } = require("../modules/weeklyReviewRenderer");
const { getUsersInTimezone } = require("../modules/userAPIHelper");
const { getBaseLocation } = require("../modules/baseHelper");

exports.run = (client) => {
  // set cron to be GMT + 12
  cron.setTimezone("Etc/GMT+12");

  // run ““At minute 0 and 30.” any day of the week
  // https://crontab.guru/#0_0-23_*_*_0
  cron.schedule("0,30 * * * *", async () => {

    // get time at GMT + 8
    const GMToffset = new Date().getTimezoneOffset();
    const GMTTime = new Date(new Date().getTime() + GMToffset * 60 * 1000);
    // get GMT+12 time and round it to nearest 30minutes
    const GMT12Time = new Date(new Date(GMTTime.getTime() + 12 * 60 * 60 * 1000) - new Date(GMTTime.getTime() + 12 * 60 * 60 * 1000).getTime() % (30 * 60 * 1000));

    // check it's between sunday 6pm and monday 8pm
    if ((GMT12Time.getDay() === 0 && GMT12Time.getHours() >= 18) || (GMT12Time.getDay() === 1 && GMT12Time.getHours() <= 20)) {

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

      // convert GMT+12 current time and GMT+12 sunday6pm time to universal offset by subtracting the difference from 12
      // for example if at GMT+12 it is 10pm and at GMT+8 it is 6pm, then the difference is 4 hours
      // 12 - 4 = 8
      // therefore we must get all users that have set their timezone to GMT+8

      const offset = 12 - difference;

      getUsersInTimezone(offset, (users) => {
        //only get discord users
        users = users.filter(u => u.discordid);
        //exit if no users found
        if (users.length === 0) return;

        //Get unique skills/challengess from users as list
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
    }

  });
};
