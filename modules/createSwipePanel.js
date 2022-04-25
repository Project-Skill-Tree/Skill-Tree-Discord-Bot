const {MessageActionRow, MessageButton, MessageEmbed} = require("discord.js");
/** @module createSwipePanel */

/**
 * Create swipeable panel
 * Adds left/right embedded buttons to a discord message to navigate through the swipeable list
 * List is cyclic and cycles back to the start
 * @param {Client} client - Discord bot client
 * @param {User} user - User who sent the message
 * @param {MessageEmbed} msg - Discord embedded message object
 * @param {Swipeable[]} list - List of swipeable objects
 */
exports.createSwipePanel = function(client, user, msg, list) {
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


/**
 * Create swipeable panel
 * Adds left/right embedded buttons to a discord message to navigate through the swipeable list
 * List is cyclic and cycles back to the start
 * @param {Client} client - Discord bot client
 * @param {User} user - User who sent the message
 * @param {MessageEmbed} msg - Discord embedded message object
 * @param {Swipeable[]} list - List of swipeable objects
 * @param {?string=} actionName - Label for the action to be completed on this page (e.g. "START")
 * @param {?function=} action - function to run on action button pressed, takes current item as parameter
 */
exports.createLargeSwipePanel = function(client, user, msg, list, actionName=null, action=null) {
  let currentPage = 0;
  const currentPageButton = new MessageButton().setCustomId("current");

  //Create action button if defined
  if (action) {
    currentPageButton
      .setLabel(`${actionName} ${currentPage+1}/${list.length}`)
      .setStyle("SUCCESS")
      .setDisabled(false);
  } else {
    currentPageButton
      .setLabel(`${currentPage+1}/${list.length}`)
      .setStyle("SECONDARY")
      .setDisabled(true);
  }

  //Add left/right messageButton to message
  const row = new MessageActionRow()
    .addComponents(
      new MessageButton()
        .setCustomId("first")
        .setLabel("FIRST")
        .setStyle("PRIMARY"),
      new MessageButton()
        .setCustomId("prev")
        .setLabel("PREV")
        .setStyle("PRIMARY"),
      currentPageButton,
      new MessageButton()
        .setCustomId("next")
        .setLabel("NEXT")
        .setStyle("PRIMARY"),
      new MessageButton()
        .setCustomId("last")
        .setLabel("LAST")
        .setStyle("PRIMARY"),
    );

  msg.edit({components: [row]});

  //Create listener for navigation events
  const filter = i => (i.customId === "prev"
    || i.customId === "next"
    || i.customId === "first"
    || i.customId === "last") && i.user.id === user.id;

  const collector = msg.createMessageComponentCollector({ filter, time: 30000 });
  collector.on("collect", async i => {
    switch (i.customId) {
      case "first":
        currentPage = 0;
        break;
      case "prev":
        currentPage--;
        if (currentPage === -1) currentPage = list.length - 1;
        break;
      case "next":
        currentPage++;
        if (currentPage === list.length) currentPage = 0;
        break;
      case "last":
        currentPage = list.length - 1;
        if (currentPage === -1) currentPage = list.length - 1;
        break;
      default: break;
    }

    //Update page number
    if (action) {
      //Set action name and page number
      row.components[2].setLabel(`${actionName} ${currentPage + 1}/${list.length}`);
    } else {
      row.components[2].setLabel(`${currentPage + 1}/${list.length}`);
    }
    msg.edit({components: [row]});

    //update embed to show current page
    const data = await list[currentPage].update(new MessageEmbed(msg.embeds[0]));
    await msg.removeAttachments();
    msg.edit({embeds: data[0], files: data[1]});
    await i.deferUpdate();
  });

  if (action) {
    const actionFilter = i => i.customId === "action" && i.user.id === user.id;
    const actionCollector = msg.createMessageComponentCollector({ actionFilter, time: 30000 });
    actionCollector.on("collect", async i => {
      await i.deferUpdate();
      action(list[currentPage]);
    });
  }
};