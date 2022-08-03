// Load up the discord.js library
const { Client, Collection } = require("discord.js");
// We also load the rest of the things we need in this file:
const fs = require("fs");
const { intents, partials, permLevels } = require("./config.js");
const logger = require("./modules/logger.js");
const {registerFont} = require("canvas");
const Path = require("path");
const settings = require("./modules/settings");
const config = require("./config");

registerFont("./assets/fonts/Akira.otf", { family: "Akira"});

// This is your client. Some people call it `bot`, some people call it `self`,
// some might call it `cootchie`. Either way, when you see `client.something`,
// or `bot.something`, this is what we're referring to. Your client.
const client = new Client({ intents, partials });

// Aliases, commands and slash commands are put in collections where they can be
// read from, catalogued, listed, etc.
const commands = new Collection();
const aliases = new Collection();
const slashcmds = new Collection();

// Generate a cache of client permissions for pretty perm names in commands.
const levelCache = {};
for (let i = 0; i < permLevels.length; i++) {
  const thisLevel = permLevels[i];
  levelCache[thisLevel.name] = thisLevel.level;
}

// To reduce client pollution we'll create a single container property
// that we can attach everything we need to.
client.container = {
  commands,
  aliases,
  slashcmds,
  levelCache,
};

// We're doing real fancy node 8 async/await stuff here, and to do that
// we need to wrap stuff in an anonymous function. It's annoying but it works.

const init = async () => {

  //Initialise settings
  await settings.set("default", config.defaultSettings);

  // Here we load **commands** into memory, as a collection, so they're accessible
  // here and everywhere else.
  //No need to load commands but leaving this here if we change that in
  //the future

  // NOTE: Enable again if wanting to experiment with text-based commands
  /*const files = [];
  getFiles("./commands/", files);
  const commands = files.filter(file => file.endsWith(".js"));
  for (const file of commands) {
    const props = require(`./${file}`);
    logger.log(`Loading Command: ${props.help.name}. 👌`, "log");
    client.container.commands.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
      client.container.aliases.set(alias, props.help.name);
    });
  }*/


  // Now we load any **slash** commands you may have in the ./slash directory.
  const slashFiles = [];
  getFiles("./slash/", slashFiles);
  const slashCommands = slashFiles.filter(file => file.endsWith(".js"));
  for (const file of slashCommands) {
    const command = require(`./${file}`);
    const commandName = file.split(".")[0];
    logger.log(`Loading Slash command: ${commandName}. 👌`, "log");
    
    // Now set the name of the command with it's properties.
    client.container.slashcmds.set(command.commandData.name, command);
  }

  // Then we load events, which will include our message and ready event.
  const eventFiles = fs.readdirSync("./events/").filter(file => file.endsWith(".js"));
  for (const file of eventFiles) {
    const eventName = file.split(".")[0];
    logger.log(`Loading Event: ${eventName}. 👌`, "log");
    const event = require(`./events/${file}`);
    // Bind the client to any event, before the existing arguments
    // provided by the discord.js event. 
    // This line is awesome by the way. Just sayin'.
    client.on(eventName, event.bind(null, client));
  }

  const scheduledEvents = fs.readdirSync("./scheduled/").filter(file => file.endsWith(".js"));
  for (const file of scheduledEvents) {
    const eventName = file.split(".")[0];
    logger.log(`Loading Scheduled Events: ${eventName}. 👌`, "log");
    const event = require(`./scheduled/${file}`);
    event.run(client);
  }

  // Threads are currently in BETA.
  // This event will fire when a thread is created, if you want to expand
  // the logic, throw this in it's own event file like the rest.
  client.on("threadCreate", (thread) => thread.join());

  // Here we login the client.
  client.login();

// End top-level async/await function.
};

function getFiles(dir, files) {
  fs.readdirSync(dir).forEach(file => {
    const abs = Path.join(dir, file);
    if (fs.statSync(abs).isDirectory()) return getFiles(abs, files);
    else return files.push(abs);
  });
}

init();
