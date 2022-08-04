require("dotenv").config();
const axios = require("axios");
const Enmap = require("enmap");

// Now we integrate the use of Evie's awesome Enmap module, which
// essentially saves a collection to disk. This is great for per-server configs,
// and makes things extremely easy for this purpose.

class Settings {
  constructor() {
    this.client = new Enmap({
      name: "settings"
    });
    // Get all the configs from the API and set them in enmap.
    axios.get(`${process.env.API_URL}config/`, {
      headers: {
        api_key: process.env.API_KEY
      }
    }).then(res => {
      res.data.data.forEach(config => {
        const serverId = config.serverId;
        delete config.serverId;
        this.client.set(serverId, config);
      });
    });
  }

  get(guild) {
    return this.client.get(guild);
  }

  async set(guild, value, key) {
    // Check if the guild is set as "default", if so then we only want to set it in enmap
    // if it is not already set.
    if (guild === "default") {
      return this.client.set("default", value, key);
    }

    // Set the settings on the API as well as the local enmap.
    const body = {serverId: guild};
    if (key) {
      body[key] = value;
    }
    await axios.put(`${process.env.API_URL}config/setConfig`, body, {
      headers: {
        api_key: process.env.API_KEY
      }
    });
    return this.client.set(guild, value, key);
  }

  // This is the same as the set command, but it will only set the value if it is not already set.
  ensure(guild, value) {
    if (!this.get(guild)) {
      this.set(guild, value);
    }
  }

  has(guild) {
    return this.client.has(guild);
  }
}

module.exports = new Settings();