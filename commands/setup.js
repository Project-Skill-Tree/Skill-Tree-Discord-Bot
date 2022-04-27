const {createAccount} = require("../modules/APIHelper");

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  createAccount(message.author.id).then(() => {
    console.log("User added!");
  }).catch(res => {
    console.log("Error: user could not be added");
    console.log(res);
  });
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "setup",
  category: "Skill Tree",
  description: "Create an account with the bot to use commands",
  usage: "profile"
};
