const {MessageActionRow, MessageButton, MessageEmbed} = require("discord.js");

/**
 * Create swipeable panel
 * @param {Client} client - Discord bot client
 * @param {User} user - User who sent the message
 * @param {MessageEmbed} msg - Discord embedded message object
 * @param {Swipeable[]} list - List of swipeable skills
 */
module.exports.createSwipePanel = function(client, user, msg, list) {
  let currentPage = 0;

  //Add left/right messageButton to message
  const row = new MessageActionRow()
    .addComponents(
      new MessageButton()
        .setCustomId("left")
        .setLabel("<")
        .setStyle("PRIMARY"),
      new MessageButton()
        .setCustomId("right")
        .setLabel(">")
        .setStyle("PRIMARY"),
    );
  msg.edit({components: [row]});

  //Create listener for button events
  const filter = i => (i.customId === "left" || i.customId === "right") && i.user.id === user.id;
  const collector = msg.createMessageComponentCollector({ filter, time: 30000 });
  collector.on("collect", async i => {
    await i.deferUpdate();
    switch (i.customId) {
      case "left":
        currentPage--;
        if (currentPage === -1) currentPage = list.length - 1;
        break;
      case "right":
        currentPage++;
        if (currentPage === list.length) currentPage = 0;
        break;
      default: break;
    }
    //update embed
    const data = await list[currentPage].update(new MessageEmbed(msg.embeds[0]));
    await msg.removeAttachments();
    msg.edit({embeds: data[0], files: data[1]});
  });
};