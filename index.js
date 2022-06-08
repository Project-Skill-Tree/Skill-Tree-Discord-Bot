// This will check if the node version you are running is the required
// Node version, if it isn't it will throw the following error to inform
// you.
if (Number(process.version.slice(1).split(".")[0]) < 16) throw new Error("Node 16.x or higher is required. Update Node on your system.");
require("dotenv").config();

const { ShardingManager } = require("discord.js");

const manager = new ShardingManager("./bot.js", { token: process.env.DISCORD_TOKEN});

manager.on("shardCreate", shard => console.log(`Launched shard ${shard.id}`));

manager.spawn();