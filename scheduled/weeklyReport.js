const cron = require("node-cron");
const {getRecentTasks} = require("../modules/APIHelper");
const {displayReview} = require("../modules/weeklyReviewRenderer");

exports.run = () => {
  //Schedule a job every sunday
  cron.schedule('0 0 * * 0', function() {
    getUsers((users)=>{
      for(const user in users){
        //Get last 7 days worth of tasks
        getRecentTasks(user.id, 7, (tasks) => {
          //Display weekly analytics
          displayReview(user.id, message.channel, tasks);
        });
      }
    })
  });
};