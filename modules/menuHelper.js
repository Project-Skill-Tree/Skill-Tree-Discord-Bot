const {MessageActionRow, MessageButton, MessageEmbed} = require("discord.js");
const {MessageSelectMenu} = require("discord.js");

/** @module createSwipePanel */

/**
 * Create swipeable panel
 * Adds left/right embedded buttons to a discord message to navigate through a swipeable list
 * List is cyclic and cycles back to the start
 * @param {Client} client - Discord bot client
 * @param {User} user - User who sent the message
 * @param {Channel} channel - Discord channel to send to
 * @param {Swipeable[]} list - List of swipeable objects
 */
exports.createSwipePanel = async function(client, user, channel, list) {
  const msg = await list[0].send(channel);
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
  const collector = msg.createMessageComponentCollector({ filter, time: 86000 });
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
 * @param {Channel} channel - Discord channel
 * @param {Swipeable[]} list - List of swipeable objects
 * @param {?[]=} actions - action name/description/action pairs
 * item as parameter - return value is T/F based on whether this item will be removed or not
 */
exports.createLargeSwipePanel = async function(client, user, channel,
  list, actions = null) {
  const msg = await list[0].send(channel);
  let currentPage = 0;

  update(channel, msg, list, currentPage, actions);

  //Create listener for navigation events
  const filter = i => (i.customId === "prev"
    || i.customId === "next"
    || i.customId === "first"
    || i.customId === "last") && i.user.id === user.id;

  const collector = msg.createMessageComponentCollector({filter, time: 100000});
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
      default:
        break;
    }
    await update(channel, msg, list, currentPage, actions);
    await i.deferUpdate();
  });

  //Create action listener
  if (actions == null) return;

  const actionFilter = i => i.user.id === user.id;
  const actionCollector = msg.createMessageComponentCollector({actionFilter, time: 100000});
  actionCollector.on("collect", async i => {
    //If action found
    const action = actions.filter((v) => v.name === i.customId)[0];
    if (action) {
      const deleteItem = action.action(list[currentPage]);
      //Delete item on action
      if (deleteItem) {
        const toRemove = list[currentPage];
        list = list.filter(i => i !== toRemove);
        //Set page index
        currentPage = Math.max(currentPage - 1, 0);
        await update(channel, msg, list, currentPage, actions);
      }
    }
    await i.deferUpdate();
  });
};

async function update(channel, msg, list, currentPage, actions) {
  //check for empty list
  if (list.length === 0) {
    msg.delete();
    const embed = new MessageEmbed();
    embed.setTitle("EMPTY");
    embed.setDescription("No more items to display");
    embed.setThumbnail("");
    channel.send({embeds: [embed]});
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
  if (msg.attachments.size !== 0) {
    await msg.removeAttachments();
  }
  msg.edit({embeds: data[0], components: components, files: data[1]});
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
            label: action.name,
            description: action.description,
            value: action.name,
          };
        }
      )
    )
  );
}
