const {MessageActionRow, MessageButton, MessageEmbed} = require("discord.js");

function createChildButtons(root) {
  const row = new MessageActionRow();
  //add button to go back
  if (root.parent !== undefined && root.parent !== null)
  {
    row.addComponents(
      new MessageButton()
        .setCustomId("prev")
        .setLabel("<")
        .setStyle("PRIMARY")
    );
  }

  // add a button for every child
  root.children.forEach(function(item) {
    row.addComponents(
      new MessageButton()
        .setCustomId(String(root.children.indexOf(item)))
        .setLabel(`${item.title} ${item.level}`)
        .setStyle("PRIMARY")
    );
  });

  return row;
}

module.exports = function(client, user, msg, start) {

  //add initial buttons
  const row = createChildButtons(start);
  msg.edit({components: [row]});


  // next skill to be displayed, set to tree root
  var nextSkill = start;

  //Create listener for button events
  const filter = i => (start.children[i.customId] !== undefined || i.customId == "prev") && i.user.id === user.id;
  const collector = msg.createMessageComponentCollector({ filter, time: 30000 });
  collector.on("collect", async i => {
    await i.deferUpdate();
    if (i.customId == "prev") {
      // go back to parent
      nextSkill = nextSkill.parent;
    }
    else {
      // go to child
      nextSkill = nextSkill.children[i.customId];
    }

    // magic stuff someone else wrote
    const data = await nextSkill.update(new MessageEmbed(msg.embeds[0]));
    await msg.removeAttachments();

    // create new buttons for this skill and edit the message
    const row = createChildButtons(nextSkill);
    msg.edit({embeds: data[0], files: data[1], components: [row]});
  });
};
