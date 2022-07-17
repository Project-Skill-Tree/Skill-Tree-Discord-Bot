const { version } = require("discord.js");
const { codeBlock } = require("@discordjs/builders");
const { DurationFormatter } = require("@sapphire/time-utilities");
const durationFormatter = new DurationFormatter();

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  const duration = durationFormatter.format(client.uptime);
  const promises = [
    client.shard.fetchClientValues("guilds.cache.size"),
    client.shard.broadcastEval(c => c.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)),
  ];

  let totalGuilds, totalMembers;
  await Promise.all(promises)
    .then(results => {
      totalGuilds = results[0].reduce((acc, guildCount) => acc + guildCount, 0);
      totalMembers = results[1].reduce((acc, memberCount) => acc + memberCount, 0);
    })
    .catch(console.error);

  const stats = codeBlock("asciidoc", `= STATISTICS =
  • Mem Usage     :: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB
  • Uptime        :: ${duration}
  • Users         :: ${totalMembers}
  • Servers       :: ${client.guilds.cache.size.toLocaleString()}
  • Channels      :: ${client.channels.cache.size.toLocaleString()}
  • Last Ready    :: ${client.readyAt}
  • Discord.js    :: v${version}
  • Node          :: ${process.version}
  • Total Servers :: ${totalGuilds}`);
  message.channel.send(stats);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "bot",
  category: "Miscellaneous",
  description: "Gives some useful bot statistics",
  usage: "bot"
};
