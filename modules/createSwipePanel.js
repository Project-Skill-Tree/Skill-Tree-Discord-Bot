const {MessageEmbed} = require("discord.js");

module.exports = function(command, msg, list) {
  var currentPage = 0;
  msg.react("⬅️").then(() => {
    msg.react("➡️");

    // Filters
    const backwardsFilter = (reaction, user) => reaction.emoji.name === "⬅️" && user.id === msg.author.id;
    const forwardsFilter = (reaction, user) => reaction.emoji.name === "➡️" && user.id === msg.author.id;

    const backwards = msg.createReactionCollector(backwardsFilter, {timer: 6000});
    const forwards = msg.createReactionCollector(forwardsFilter, {timer: 6000});

    //add reaction listener
    backwards.on("collect", () => {
      currentPage--;
      if (currentPage === -1) currentPage = list.length - 1;
      //update embed
      const embed = list[currentPage].update(msg.embeds[0]);
      msg.edit(embed);
      //remove reaction
      //r.users.remove(command.author.id);
    });

    //add reaction listener
    forwards.on("collect", () => {
      currentPage++;
      if (currentPage === list.length) currentPage = 0;
      //update embed
      const embed = new MessageEmbed() //For discord v11 Change to new Discord.RichEmbed()
        .setDescription("TEST");
      msg.edit(embed);
      //remove reaction
      //r.users.remove(command.author.id);
    });
  });
};