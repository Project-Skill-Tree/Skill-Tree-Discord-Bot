const {MessageActionRow, MessageButton, MessageEmbed} = require("discord.js");

module.exports = function(client, user, msg, root) {

  var children = [];
  const row = new MessageActionRow();
  //add button to go back
  if (root.parent !== undefined && root.parent !== null)
  {
    row.addComponents(
      new MessageButton()
        .setCustomId("-1")
        .setLabel("<")
        .setStyle("PRIMARY")
    );
  }
  root.children.forEach(function(item) {
    row.addComponents(
      new MessageButton()
        .setCustomId(String(root.children.indexOf(item)))
        .setLabel(`${item.title} ${item.level}`)
        .setStyle("PRIMARY")
    );
    // save id to later filter in listener
    children.push(root.children.indexOf(item));
  });
  msg.edit({components: [row]});

  //Create listener for button events
  const filter = i => (root.children[i.customId] !== undefined || i === "-1") && i.user.id === user.id;
  const collector = msg.createMessageComponentCollector({ filter, time: 30000 });
  collector.on("collect", async i => {
    await i.deferUpdate();
    //still figuring this out
    if (i === "-1") {
      // go to parent
    }
    else {
      //goto child
      const data = await root.children[i.customId].update(new MessageEmbed(msg.embeds[0]));
      await msg.removeAttachments();
      msg.edit({embeds: data[0], files: data[1]});
    }

  });
};
