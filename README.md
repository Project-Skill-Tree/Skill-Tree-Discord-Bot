# Skill-Tree-Discord-Bot
The Skill Tree Discord Bot allows users to keep track of their self-improvement progress effortlessly through Discord.

[![Discord](https://badgen.net/badge/icon/discord?icon=discord&label)](https://discord.gg/skilltree)
![GitHub commits](https://badgen.net/github/license/Project-Skill-Tree/Skill-Tree-Discord-Bot)
[![GitHub commits](https://badgen.net/github/stars/Project-Skill-Tree/Skill-Tree-Discord-Bot)](https://github.com/Project-Skill-Tree/Skill-Tree-Discord-Bot/stargazers)

## Tech
- [DiscordJS](https://discord.js.org/#/) NodeJS module to interact with Discord's Data
- [Node.js](https://nodejs.org/en/) JavaScript runtime
- [NPM](https://www.npmjs.com/) Package manager for Node.js
- [guidebot](https://github.com/AnIdiotsGuide/guidebot/) Boilerplate example Discord bot
- [Mongoose.js](https://mongoosejs.com/) An Object Data Modeling (ODM) library for MongoDB and Node.js

## Requirements

- `git` command line ([Windows](https://git-scm.com/download/win) | [Linux](https://git-scm.com/download/linux) | [MacOS](https://git-scm.com/download/mac)) installed
- `node` [Version 16.x](https://nodejs.org)
- The node-gyp build tools. This is a pre-requisite for Enmap, but also for a **lot** of other modules. See [The Enmap Guide](https://enmap.evie.dev/install#pre-requisites) for details and requirements for your OS. Just follow what's in the tabbed block only, then come back here!

You also need your bot's token. This is obtained by creating an application
at [the Discord developer section](https://discord.com/developers/applications). Check the [first section of this page](https://anidiots.guide/getting-started/getting-started-long-version)
for more info.

## Installation

Create a folder within your projects directory and run the following inside it:

`git clone https://github.com/Project-Skill-Tree/Skill-Tree-Discord-Bot.git`

Once finished:

- In the folder from where you ran the git command, run `npm install`, which will install the required packages.
- Make sure you're using node.js `v16.14.2`
- Rename `.env-example` to `.env` and put each key inside as follows
  - DISCORD_TOKEN - Your bot token
  - OWNER - Your discord ID
  - API_URL - The URL of your API instance (for example: http://localhost:3000/v1, must include /v1/ at the end)
  - API_KEY - The API key (Can be anything, shared between bot and API)
  - GOOGLE_API_KEY - Google maps API key
- Set up the [API](https://github.com/Project-Skill-Tree/Skill-Tree-API)
- Set up the [editor](https://github.com/Project-Skill-Tree/Skill-Tree-Editor)
## Starting the bot

To start the bot, in the command prompt, run the following command:
`node index.js`

## Contributing
Read up on [GitHub flow](https://docs.github.com/en/get-started/quickstart/github-flow) for instructions on code contribution.
Read the [documentation wiki](https://www.projectskilltree.com)
### Setting up a development environment
Read [Installation](#installation) to get started.

This project uses Eslint for code formatting. Install it [here](https://eslint.org/) and run it before making a pull request with your changes.<br>
You can run Eslint via `npx eslint --fix .`.