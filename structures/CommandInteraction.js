const { CommandInteraction, MessagePayload } = require("discord.js");
const resources = require("../modules/resources");

module.exports.run = () => {
  CommandInteraction.prototype.reply = async function(options) {
    if (this.deferred || this.replied) throw new Error("INTERACTION_ALREADY_REPLIED");
    this.ephemeral = options.ephemeral ?? false;
    
    if (!options.resources)  options = resources.success.embed(options);
    let messagePayload;
    if (options instanceof MessagePayload) messagePayload = options;
    else messagePayload = MessagePayload.create(this, options);

    const { data, files } = await messagePayload.resolveData().resolveFiles();

    await this.client.api.interactions(this.id, this.token).callback.post({
      data: {
        type: 4,
        data,
      },
      files,
      auth: false,
    });
    this.replied = true;

    return options.fetchReply ? this.fetchReply() : undefined;
  };

  CommandInteraction.prototype.replyError = async  function(options) {
    if (this.deferred || this.replied) throw new Error("INTERACTION_ALREADY_REPLIED");
    this.ephemeral = options.ephemeral ?? false;
    if (!options.resources) options = resources.error.embed(options);
    let messagePayload;
    if (options instanceof MessagePayload) messagePayload = options;
    else messagePayload = MessagePayload.create(this, options);

    const { data, files } = await messagePayload.resolveData().resolveFiles();

    await this.client.api.interactions(this.id, this.token).callback.post({
      data: {
        type: 4,
        data,
      },
      files,
      auth: false,
    });
    this.replied = true;

    return options.fetchReply ? this.fetchReply() : undefined;
  };

  CommandInteraction.prototype.replyWarn = async  function(options) {
    if (this.deferred || this.replied) throw new Error("INTERACTION_ALREADY_REPLIED");
    this.ephemeral = options.ephemeral ?? false;
    if (!options.resources) options = resources.warn.embed(options);
    let messagePayload;
    if (options instanceof MessagePayload) messagePayload = options;
    else messagePayload = MessagePayload.create(this, options);

    const { data, files } = await messagePayload.resolveData().resolveFiles();

    await this.client.api.interactions(this.id, this.token).callback.post({
      data: {
        type: 4,
        data,
      },
      files,
      auth: false,
    });
    this.replied = true;

    return options.fetchReply ? this.fetchReply() : undefined;
  };

  CommandInteraction.prototype.editReply = async function(options) {
    if (!this.deferred && !this.replied) throw new Error("INTERACTION_NOT_REPLIED");
    if (!options.resources) options = resources.success.embed(options);
    const message = await this.webhook.editMessage("@original", options);
    this.replied = true;
    return message;
  };

  CommandInteraction.prototype.editReplyError = async  function(options) {
    if (!this.deferred && !this.replied) throw new Error("INTERACTION_NOT_REPLIED");
    if (!options.resources) options = resources.error.embed(options);
    const message = await this.webhook.editMessage("@original", options);
    this.replied = true;
    return message;
  };

  CommandInteraction.prototype.editReplyWarn = async  function(options) {
    if (!this.deferred && !this.replied) throw new Error("INTERACTION_NOT_REPLIED");
    if (!options.resources) options = resources.warn.embed(options);
    const message = await this.webhook.editMessage("@original", options);
    this.replied = true;
    return message;
  };

  CommandInteraction.prototype.followUp = function(options) {
    if (!this.deferred && !this.replied) return Promise.reject(new Error("INTERACTION_NOT_REPLIED"));
    if (!options.resources) options = resources.success.embed(options);
    return this.webhook.send(options);
  };

  CommandInteraction.prototype.followUpError = function(options) {
    if (!this.deferred && !this.replied) return Promise.reject(new Error("INTERACTION_NOT_REPLIED"));
    if (!options.resources) options = resources.error.embed(options);
    return this.webhook.send(options);
  };

  CommandInteraction.prototype.followUpWarn = function(options) {
    if (!this.deferred && !this.replied) return Promise.reject(new Error("INTERACTION_NOT_REPLIED"));
    if (!options.resources) options = resources.warn.embed(options);
    return this.webhook.send(options);
  };

  CommandInteraction.prototype.update = async function(options) {
    if (this.deferred || this.replied) throw new Error("INTERACTION_ALREADY_REPLIED");

    if (!options.resources) options = resources.success.embed(options);
    let messagePayload;
    if (options instanceof MessagePayload) messagePayload = options;
    else messagePayload = MessagePayload.create(this, options);

    const { data, files } = await messagePayload.resolveData().resolveFiles();

    await this.client.api.interactions(this.id, this.token).callback.post({
      data: {
        type: 7,
        data,
      },
      files,
      auth: false,
    });
    this.replied = true;

    return options.fetchReply ? this.fetchReply() : undefined;
  };

  CommandInteraction.prototype.updateError = async function(options) {
    if (this.deferred || this.replied) throw new Error("INTERACTION_ALREADY_REPLIED");

    if (!options.resources) options = resources.error.embed(options);
    let messagePayload;
    if (options instanceof MessagePayload) messagePayload = options;
    else messagePayload = MessagePayload.create(this, options);

    const { data, files } = await messagePayload.resolveData().resolveFiles();

    await this.client.api.interactions(this.id, this.token).callback.post({
      data: {
        type: 7,
        data,
      },
      files,
      auth: false,
    });
    this.replied = true;

    return options.fetchReply ? this.fetchReply() : undefined;
  };

  CommandInteraction.prototype.updateWarn = async function(options) {
    if (this.deferred || this.replied) throw new Error("INTERACTION_ALREADY_REPLIED");

    if (!options.resources) options = resources.warn.embed(options);
    let messagePayload;
    if (options instanceof MessagePayload) messagePayload = options;
    else messagePayload = MessagePayload.create(this, options);

    const { data, files } = await messagePayload.resolveData().resolveFiles();

    await this.client.api.interactions(this.id, this.token).callback.post({
      data: {
        type: 7,
        data,
      },
      files,
      auth: false,
    });
    this.replied = true;

    return options.fetchReply ? this.fetchReply() : undefined;
  };
};