const cron = require('node-cron');
const { getUsers } = require('../modules/userAPIHelper');
const { getBaseLocation } = require('../modules/baseHelper.js');

let slackingMessage = ", you have not tracked anything for two days. Get back to work!";

// Check if users have been slacking
exports.run = (client) => {
  cron.schedule("0 * * * *", async () => {
    console.log("Checking for users that haven't been tracking");

    let users = await getUsers();

    let currentDate = new Date();

    users.forEach(async u => {
      // Convert epoch values (which are in milliseconds) to hours via `/ 1000 / 60 / 60`
      let currentTime = currentDate.getTime() / 1000 / 60 / 60;
      let lastTrackedTime = u.lastTracked.getTime() / 1000 / 60 / 60;

      // If 48 hours has passed since the user last tracked
      if(currentTime - lastTrackedTime > 48) {
        const channel = await getBaseLocation(client, u.discordid, u.baselocation);

        if(!channel) {
          const discorduser = await client.users.fetch(u.discordid);

          discorduser.send(discorduser.username + slackingMessage);
          return;
        }

        channel.send(`<@${u.discordid}>` + slackingMessage);
      }
    })
  })
}
