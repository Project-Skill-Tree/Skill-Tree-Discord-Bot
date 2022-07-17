const {MessageActionRow, MessageButton, MessageEmbed} = require("discord.js");
const {MessageSelectMenu} = require("discord.js");

/** @module createSwipePanel */

/**
 * Create swipeable panel
 * Adds left/right embedded buttons to a discord message to navigate through a swipeable list
 * List is cyclic and cycles back to the start
 * @param msg - embedded message to attach to
 * @param {User} user - User who sent the message
 * @param onYes - function to run on "yes" selected
 * @param onNo - function to run on "no" selected
 */
exports.createYesNoPanel = async function(msg, user, onYes, onNo) {
  //Add left/right messageButton to message
  const row = new MessageActionRow()
    .addComponents(
      new MessageButton()
        .setCustomId("yes")
        .setLabel("YES")
        .setStyle("PRIMARY"),
      new MessageButton()
        .setCustomId("no")
        .setLabel("NO")
        .setStyle("PRIMARY"),
    );
  msg.edit({components: [row]});

  //Create listener for button events
  const filter = i => (i.customId === "yes" || i.customId === "no") && i.user.id === user.id;
  const collector = msg.createMessageComponentCollector({filter, time: 240000});
  await new Promise( (resolve, reject) => {
    collector.on("collect", async i => {
      await i.deferUpdate();
      msg.delete();
      switch (i.customId) {
        case "yes":
          await onYes();
          resolve();
          break;
        case "no":
          await onNo();
          resolve();
          break;
        default:
          reject(new Error("Invalid option in yes/no panel"));
          break;
      }
    });
  });
};


/**
 * Create swipeable panel
 * Adds left/right embedded buttons to a discord message to navigate through a swipeable list
 * List is cyclic and cycles back to the start
 * @param {Client} client - Discord bot client
 * @param {User} message - Message from the user
 * @param {Swipeable[]} list - List of swipeable objects
 */
exports.createSwipePanel = async function(client, message, list) {
  const msg = await list[0].send(message);
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
  const filter = i => (i.customId === "left" || i.customId === "right") && i.user.id === message.author.id;
  const collector = msg.createMessageComponentCollector({filter, time: 240000});
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
 * @param {User} message - Message from the user
 * @param {Swipeable[]} list - List of swipeable objects
 * @param {?{}=} actions - action {name: string, description: string, action: function} map
 * item as parameter - return value is T/F based on whether this item will be removed or not
 * @param refresh - action to happen on update
 */
exports.createLargeSwipePanel = async function(client, message,
  list, actions = null, refresh=null) {
  const msg = await list[0].send(message);
  let currentPage = 0;

  await update(message, msg, list, currentPage, actions);

  //Create listener for navigation events
  const filter = i => (i.customId === "prev"
    || i.customId === "next"
    || i.customId === "first"
    || i.customId === "last") && i.user.id === message.author.id;

  const collector = msg.createMessageComponentCollector({filter, time: 240000});
  collector.on("collect", async i => {
    if (!i.isButton()) return;

    await i.deferUpdate();
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
      default:
        break;
    }
    await update(message, msg, list, currentPage, actions);
  });


  //Create action listener
  if (actions == null) return;

  const actionFilter = i => i.user.id === message.author.id;
  const actionCollector = msg.createMessageComponentCollector({actionFilter, time: 240000});
  actionCollector.on("collect", async i => {
    if (!i.isSelectMenu()) return;
    await i.deferUpdate();

    //If action found
    const action = actions.filter((v) => v.name === i.values[0])[0];
    if (action) {
      const deleteItem = await action.action(list[currentPage]);
      //Delete item on action
      if (deleteItem) {
        if (refresh) {
          msg.delete();
          refresh();
          return;
        }
        const toRemove = list[currentPage];
        list = list.filter(i => i !== toRemove);
        //Set page index
        currentPage = Math.max(currentPage - 1, 0);
        await update(message, msg, list, currentPage, actions);
      }
    }
  });

  return msg;
};

/**
 * Create swipeable panel with different actions for each page
 * Adds left/right embedded buttons to a discord message to navigate through the swipeable list
 * List is cyclic and cycles back to the start
 * @param {Client} client - Discord bot client
 * @param {User} message - Message from the user
 * @param {Swipeable[]} list - List of swipeable objects
 * @param {?[{}]=} actions - action {name: string, description: string, action: function} map
 * item as parameter - return value is T/F based on whether this item will be removed or not
 */
exports.createLargeMultiActionSwipePanel = async function(client, message,
  list, actions = null) {
  const msg = await list[0].send(message);
  let currentPage = 0;

  await update(message, msg, list, currentPage, actions[currentPage]);

  //Create listener for navigation events
  const filter = i => (i.customId === "prev"
    || i.customId === "next"
    || i.customId === "first"
    || i.customId === "last") && i.user.id === message.author.id;

  const collector = msg.createMessageComponentCollector({filter, time: 120000});
  collector.on("collect", async i => {
    if (!i.isButton()) return;

    await i.deferUpdate();
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
      default:
        break;
    }
    await update(message, msg, list, currentPage, actions[currentPage]);
  });


  //Create action listener
  if (actions == null) return;

  const actionFilter = i => i.user.id === message.author.id;
  const actionCollector = msg.createMessageComponentCollector({actionFilter, time: 120000});
  actionCollector.on("collect", async i => {
    if (!i.isSelectMenu()) return;
    await i.deferUpdate();

    //If action found
    const action = actions[currentPage].filter((v) => v.name === i.values[0])[0];
    if (action) {
      const actionIndex = actions[currentPage].indexOf(action);
      const deleteItem = await action.action(list[currentPage].list[actionIndex]);
      //Delete item on action
      if (deleteItem) {
        list[currentPage].list.splice(actionIndex,1);
        actions[currentPage].splice(actionIndex,1);
        if (list[currentPage].list.length === 0) {
          list.splice(currentPage, 1);
        }
        //Set page index
        currentPage = Math.max(currentPage - 1, 0);
        await update(message, msg, list, currentPage, actions[currentPage]);
      }
    }
  });
};


async function update(message, msg, list, currentPage, actions) {
  //check for empty list
  if (list.length === 0) {
    msg.delete();
    const embed = new MessageEmbed();
    embed.setTitle("EMPTY");
    embed.setDescription("No more items to display");
    embed.setThumbnail("");
    message.reply({embeds: [embed]});
    return;
  }

  //Add navigation buttons to row
  const components = [];
  const row = createRow(currentPage, list.length);
  components.push(row);
  if (actions) {
    components.push(createDropDownBox(actions));
  }

  //update embed to show current page
  const data = await list[currentPage].update(new MessageEmbed(msg.embeds[0]));
  if (msg.embeds[0].thumbnail !== null && msg.embeds[0].thumbnail.length !== 0) {
    await msg.removeAttachments();
  }
  await msg.edit({embeds: data[0], components: components, files: data[1]});
}

function createRow(currentPage, length) {
  return new MessageActionRow()
    .addComponents(
      new MessageButton()
        .setCustomId("first")
        .setLabel("FIRST")
        .setStyle("PRIMARY"),
      new MessageButton()
        .setCustomId("prev")
        .setLabel("PREV")
        .setStyle("PRIMARY"),
      new MessageButton()
        .setCustomId("current")
        .setLabel(`${currentPage + 1}/${length}`)
        .setStyle("SECONDARY")
        .setDisabled(true),
      new MessageButton()
        .setCustomId("next")
        .setLabel("NEXT")
        .setStyle("PRIMARY"),
      new MessageButton()
        .setCustomId("last")
        .setLabel("LAST")
        .setStyle("PRIMARY"),
    );
}

function createDropDownBox(actions) {
  const actionList = actions.map(a => a.name).join("/");
  return new MessageActionRow().addComponents(
    new MessageSelectMenu().setCustomId("actions").setPlaceholder(actionList).addOptions(
      actions.map(
        action => {
          return {
            customId: action.name,
            label: action.name,
            description: action.description,
            value: action.name,
          };
        }
      )
    )
  );
}
