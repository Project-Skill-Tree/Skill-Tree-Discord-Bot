const {MessageEmbed} = require("discord.js");
const {createYesNoPanel} = require("../../modules/menuHelper");

/**
 * Timezone command, sets the user's local timezone offset
 */
exports.run = async (client, interaction) => {
  await interaction.deferReply({ephemeral: interaction.settings.hidden});

  const action = interaction.options.getSubcommand();

  if (!interaction.guild) {
    await interaction.editReply({content: "You must be in a server to use this command"});
  }
  // Edit an existing key value
  if (action === "set") {
    //Create confirmation
    const role = interaction.options.get("role").value;
    const threshold = interaction.options.get("threshold").value;
    if (threshold < 0) {
      await interaction.editReply({content: "Threshold value out of range"});
      return;
    }
    const confirmEmbed = new MessageEmbed()
      .setColor("#3bffbe")
      .setTitle("AUTO-PROMOTE")
      .setDescription(`Users will be promoted to <@&${role}> after tracking for ${threshold} days total`);
    const success = await createYesNoPanel(interaction, confirmEmbed);
    const message = success ? "Auto promotion successfully configured" : "Auto-promotion setup aborted";
    
    if (success) {
      await interaction.settings.setAutoPromotion(interaction.guild.id, role, threshold);
    }

    const confirmationEmbed = new MessageEmbed()
      .setColor("#3bffbe")
      .setTitle("AUTO-PROMOTE")
      .setDescription(message);
    await interaction.editReply({embeds: [confirmationEmbed], components: []});
  }
  
  if (action === "cancel") {
    const confirmEmbed = new MessageEmbed()
      .setColor("#3bffbe")
      .setTitle("AUTO-PROMOTE")
      .setDescription("Auto-promotion will be disabled (Users will keep their existing roles)");
    const confirmResult = await createYesNoPanel(interaction, confirmEmbed);
    const success  = confirmResult ? "Auto-promotion successfully cancelled" : "Auto-promotion cancellation aborted";
    if (success) {
      await interaction.settings.cancelAutoPromotion(interaction.guild.id);
    }

    const confirmationEmbed = new MessageEmbed()
      .setColor("#3bffbe")
      .setTitle("AUTO-PROMOTE")
      .setDescription("Auto promotion successfully configured");
    await interaction.editReply({embeds: [confirmationEmbed], components: []});
  }
};

exports.commandData = {
  name: "autopromote",
  description: "Automatically promote users to a role if they have tracked for enough days",
  options: [
    {
      name: "cancel",
      description: "Edit server permission",
      type: 1,
      required: false,
    },
    {
      name: "set",
      description: "Edit server permission",
      type: 1,
      required: false,
      options: [
        {
          name: "role",
          description: "The role to grant",
          type: "ROLE",
          required: true,
        },
        {
          name: "threshold",
          description: "The number of days users need to track to be promoted",
          type: "INTEGER",
          required: true,
        }
      ]
    },
  ],
  defaultPermission: true,
  category: "Skill Tree",
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};