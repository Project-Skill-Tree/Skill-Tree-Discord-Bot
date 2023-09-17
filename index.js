// This will check if the node version you are running is the required
// Node version, if it isn't it will throw the following error to inform
// you.
if (Number(process.version.slice(1).split(".")[0]) < 16) throw new Error("Node 16.x or higher is required. Update Node on your system.");
require("dotenv").config();
const logger = require("./modules/logger.js");
const { ShardingManager } = require("discord.js");
const morgan = require('morgan')

const manager = new ShardingManager("./bot.js", { token: process.env.DISCORD_TOKEN, respawn: true });

manager.on("shardCreate", async shard => {
  console.log(`Launched shard ${shard.id}`);
  shard.on("error", error => {
    console.log(error);
  })
});

manager.spawn().then(r => console.log(`Spawned shard! Current Size: ${r.size}`));

// Create endpoint for health-endpoint.
const express = require("express");
const http = require("http");

const app = express();
const router = express.Router();
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))


router.use((_req, res, next) => {
  res.header("Access-Control-Allow-Methods", "GET");
  next();
});

router.get("/health", (req, res) => {
  const data = {
    uptime: process.uptime(),
    response_time: process.hrtime(),
    message: "OK",
    timestamp: Date.now()
  };

  try {
    res.status(200).send(data);
    logger.debug(`${req.method} ${req.url} ${req.status === null ? req.status : ""}`)
  } catch (e) {
    data.message = e;
    res.status(503).send(data);
    logger.error(`Error: \nRequest:${req}\nData:${data}`)
  }


});

let port = process.env.HEALTH_PORT
app.use("/", router);
app.disable('x-powered-by');

const server = http.createServer(app);
server.listen(port, () => logger.log(`Internal Health check on port ${port}`));
