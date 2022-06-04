const cron = require("node-cron");
const {getRecentTasks, getSkillsInList} = require("../modules/skillAPIHelper");
const {displayReview} = require("../modules/weeklyReviewRenderer");
const {getUsersInTimezone, getUsers} = require("../modules/userAPIHelper");

exports.run = (client) => {
  //Schedule a job every sunday
  cron.schedule("*/1 * * * *", function() {
    let offset = 0;
    try {
      //Round time to the nearest 30 minutes
      const currentTime = new Date();
      currentTime.setMinutes(Math.round(currentTime.getMinutes() / 30) * 30);
      //Get the nearest sunday at 6:00:00
      const dayOfWeek = currentTime.getDay();
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

    getUsers((users)=>{
      const skillIDs = Array.from(
        users
          .map(u => u.skillsinprogress) //get skills from users
          .flat() //convert to one big list
          .reduce((set, e) => set.add(e), new Set()) //only unique items
      );
      getSkillsInList(skillIDs, async (skills) => {
        const skillIDMap = new Map(
          skills.map(skill => {
            return [skill.id, skill];
          }),
        );
        for (let i = 0; i < users.length; i++) {
          const user = users[i];

          user.skillsinprogress = user.skillsinprogress.map(s => skillIDMap.get(s.id));
          //Get last 7 days worth of tasks
          getRecentTasks(user.id, 7, (tasks) => {
            if (!user.baselocation) return;
            //Display weekly analytics
            const channel = client.channels.cache.get(user.baselocation);
            displayReview(user, channel, tasks);
          });
        }
      });
    });
  });
};