const { Client, Collection } = require("discord.js")
const { DefaultBotOptions, AvailableCommandTypes, AvailableEventTypes, CommandToEvent, EventModules } = require("../util/Constants")
const CommandAdapter = require("./CommandAdapter")
const DjsBDscriptError = require("./DjsBDscriptError")

module.exports = class Bot {
    /**
     * 
     * @param {import("../util/Constants").BotOptions} options 
     */
    constructor(options = {}) {
        /**
         * @type {import("../util/Constants").BotOptions}
         */
        this.options = this._validateOptions(Object.assign(DefaultBotOptions, options))

        /**
         * @type {Client} 
         */
        this.client = new Client(this.options.client)

        /**
         * @type {Bot}
         */
        this.client.bot = this 

        /**
         * @type {Collection<string, import("discord.js").ApplicationCommandData}
         */
        this.slash_commands = new Collection()

        /**
         * @type {import("../util/Constants").Commands}
         */
        this.commands = this._dispatchCommands()

        /**
         * @type {import("..").EventTypes[]} 
         */
        this.events = []
    }

    /**
     * @private
     */
    _dispatchCommands() {
        const obj = {}
        for (const key of Object.keys(AvailableEventTypes).filter(e => !/[0-9]/.test(e))) {
            obj[key] = new Collection()
        }
        return obj 
    }

    /**
     * @private
     * @param {import("../util/Constants").BotOptions} options 
     */
    _validateOptions(options) {
        if (typeof options.prefix === "string") {
            options.prefix = [options.prefix]
        }

        return options
    }

    /**
     * Creates data for a slash command.
     * @param {import("discord.js").ApplicationCommandData} data 
     * @returns {Bot}
     */
    createSlashCommandData(data = {}) {
        if (this.slash_commands.has(data.name)) {
            throw new DjsBDscriptError("SLASH_COMMAND_ALREADY_EXISTS", data.name)
        }
        this.slash_commands.set(data.name, data)
        return this
    }
    
    /**
     * 
     * @param {import("../util/Constants").CommandData} data 
     * @returns {Bot}
     */
    command(data = {}) {
        if (AvailableCommandTypes[data.type] === undefined) {
            throw new DjsBDscriptError("INVALID_COMMAND_TYPE", data.type)
        }

        const event = CommandToEvent[data.type]

        const adapter = new CommandAdapter(data)

        this.commands[event].set(this.commands[event].size, adapter)

        return this
    }

    /**
     * @param {import("..").EventTypes|import("..").EventTypes[]} event 
     * @returns {Bot}
     */
    event(event) {
        if (!Array.isArray(event)) {
            return this.event(
                [
                    event
                ]
            )
        } else {
            for (const ev of event) {
                if (AvailableEventTypes[ev] === undefined) {
                    throw new DjsBDscriptError("INVALID_EVENT_TYPE", ev)
                }

                if (this.events.includes(ev)) {
                    throw new DjsBDscriptError("EVENT_ALREADY_REGISTERED", ev)
                }

                const mod = EventModules[ev]

                const raw = mod.split("/").reverse()[0].split(".js")[0]

                this.events.push(ev)

                this.client.on(raw, require(mod).bind(null, this.client))
            }
        }

        return this
    }

    /**
     * @param {?string} token
     */
    login(token) {
        this.client.once("ready", () => {
            console.log(`Client ready on ${this.client.user.tag}.`)
        })
        this.client.login(this.options.token ?? token)
    }
}