const cron = require("node-cron");
const { getUsers, setReminded } = require("../modules/userAPIHelper");
const { getBaseLocation } = require("../modules/baseHelper.js");

const slackingMessage = ", you have not tracked anything for two days. Get back to work!";

// Check if users have been slacking
exports.run = (client) => {
  /*cron.schedule("0 * * * *", async () => {
    console.log("Checking for users that haven't been tracking");
    
    const users = await getUsers();

    const currentDate = new Date();

    users.filter(u => 'discordid' in u).forEach(async u => {
      // Convert epoch values (which are in milliseconds) to hours via `/ 1000 / 60 / 60`
      const currentTime = currentDate.getTime() / 1000 / 60 / 60;
      const lastTrackedTime = u.lastTracked.getTime() / 1000 / 60 / 60;

      // If 48 hours has passed since the user last tracked
      if (currentTime - lastTrackedTime > 48) {
        // Check if user object has the property 'reminderSent' and check if it is false
        if (!(u.reminderSent ?? false)) {
          const channel = await getBaseLocation(client, u.discordid, u.baselocation);

          //await setReminded(u.id, true);

          if (!channel) {
            const discorduser = await client.users.fetch(u.discordid);

            discorduser.send(discorduser.username + slackingMessage);
            return;
          }

          channel.send(`<@${u.discordid}>` + slackingMessage);
        }
      }
    });
  });*/
};