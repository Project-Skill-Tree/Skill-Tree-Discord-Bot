const { version } = require("discord.js");
const { codeBlock } = require("@discordjs/builders");
const { DurationFormatter } = require("@sapphire/time-utilities");
const {getActiveUsers} = require("../../modules/userAPIHelper");
const durationFormatter = new DurationFormatter();

exports.run = async (client, interaction) => { // eslint-disable-line no-unused-vars
  await interaction.deferReply();
  const duration = durationFormatter.format(client.uptime);
  const promises = [
    await client.shard.fetchClientValues("guilds.cache.size"),
    await client.shard.broadcastEval(c => c.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)),
  ];

  let totalGuilds, totalMembers;
  await Promise.all(promises)
    .then(results => {
      totalGuilds = results[0].reduce((acc, guildCount) => acc + guildCount, 0);
      totalMembers = results[1].reduce((acc, memberCount) => acc + memberCount, 0);
    })
    .catch(console.error);
  const users = await getActiveUsers();
  const stats = codeBlock("asciidoc", `= STATISTICS =
  • Mem Usage     :: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB
  • Uptime        :: ${duration}
  • Users         :: ${totalMembers}
  • Active Users  :: ${users}
  • Servers       :: ${client.guilds.cache.size.toLocaleString()}
  • Channels      :: ${client.channels.cache.size.toLocaleString()}
  • Last Ready    :: ${client.readyAt}
  • Discord.js    :: v${version}
  • Node          :: ${process.version}
  • Total Servers :: ${totalGuilds}`);
  await interaction.editReply(stats);
};

exports.commandData = {
  name: "bot",
  description: "Show's the bots stats.",
  options: [],
  defaultPermission: true,
  category: "System",
};

// Set guildOnly to true if you want it to be available on guilds only.
// Otherwise false is global.
exports.conf = {
  permLevel: "User",
  guildOnly: false
};
