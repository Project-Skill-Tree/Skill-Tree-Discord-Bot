# ASI-DiscordBot
The self-improvement Discord bot. The first service of the Adonis Self-improvement project, allowing users to keep track of their self-improvement progress through a Discord bot.

[![Discord](https://badgen.net/badge/icon/discord?icon=discord&label)](https://discord.gg/CKKshDe8rx)
![GitHub commits](https://badgen.net/github/license/Adonis-Self-Improvement/ASI-DiscordBot)
[![GitHub commits](https://badgen.net/github/stars/Adonis-Self-Improvement/ASI-DiscordBot)](https://github.com/Adonis-Self-Improvement/ASI-DiscordBot/stargazers)

## Tech
- [DiscordJS](https://discord.js.org/#/) NodeJS module to interact with Discord's API
- [Node.js](https://nodejs.org/en/) JavaScript runtime
- [NPM](https://www.npmjs.com/) Package manager for Node.js
- [Docker](https://www.docker.com/) Containerization platform
- [guidebot](https://github.com/AnIdiotsGuide/guidebot/) Boilerplate example Discord bot

### Potential
- [Mongoose.js](https://mongoosejs.com/) An Object Data Modeling (ODM) library for MongoDB and Node.js

## Requirements

- `git` command line ([Windows](https://git-scm.com/download/win) | [Linux](https://git-scm.com/download/linux) | [MacOS](https://git-scm.com/download/mac)) installed
- `node` [Version 16.x](https://nodejs.org)
- The node-gyp build tools. This is a pre-requisite for Enmap, but also for a **lot** of other modules. See [The Enmap Guide](https://enmap.evie.codes/install#pre-requisites) for details and requirements for your OS. Just follow what's in the tabbed block only, then come back here!

You also need your bot's token. This is obtained by creating an application
at [the Discord developer section](https://discord.com/developers/applications). Check the [first section of this page](https://anidiots.guide/getting-started/getting-started-long-version)
for more info.

## Installation

Create a folder within your projects directory and run the following inside it:

`git clone https://github.com/Adonis-Self-Improvement/ASI-DiscordBot.git`

Once finished:

- In the folder from where you ran the git command, run `npm install`, which will install the required packages.
- Rename `config.js.example` to `config.js`, and give it the required intents and any partials you may require.
- Rename `.env-example` to `.env` and put in your bot token in it and save.

## Starting the bot

To start the bot, in the command prompt, run the following command:
`node index.js`

### Build the Docker image
_To be written_
