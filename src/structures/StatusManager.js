const Interpreter = require("../main/Interpreter");
const Bot = require("./Bot");
const CommandAdapter = require("./CommandAdapter");

module.exports = class StatusManager {
    /**
     * Adds a status manager to a bot.
     * @param {Bot} bot the bot this manager belongs to.
     */
    constructor(bot) {
        /**
         * @type {Bot}
         */
        this.bot = bot

        /**
         * @type {import("../util/Constants").StatusData[]}
         */
        this.statuses = []

        /**
         * @type {number}
         */
        this.current = 0

        /**
         * @type {boolean}
         */
        this.looping = false
    }

    /**
     * 
     * @param {import("../util/Constants").StatusData|import("../util/Constants").StatusData[]} status 
     * @returns {StatusManager}
     */
    add(status) {
        if (!Array.isArray(status)) {
            return this.add([status])
        }

        for (const data of status) {
            data.compiled = new CommandAdapter(data, data.name)
            this.statuses.push(data)
        }

        return this
    }

    async cycle() {
        if (!this.bot.client.readyTimestamp || !this.statuses.length) {
            await new Promise(e => setTimeout(e, 15000))
            return this.cycle()
        }

        const data = this.statuses[this.current] ?? this.statuses[0]

        if (!this.looping) return undefined

        if (!this.statuses[this.current]) this.current = 0

        const exec = await Interpreter(this.bot.client, {
            message: {
                author: this.bot.client.user,
                member: this.bot.client.guilds.cache.first().me
            },
            args: [], 
            command: data.compiled,
            returnContainer: true
        })

        if (!exec) {
            this.cycle()
            return undefined
        }

        const name = exec.content

        this.bot.client.user.setPresence({
            afk: data.afk,
            shardID: data.shardID ?? undefined,
            status: data.presence,
            activities: [
                {
                    name,
                    type: data.type.toUpperCase(),
                    url: data.url
                }
            ]
        })

        await new Promise(e => setTimeout(e, data.duration ?? 12000))

        this.current++ 

        return this.cycle()
    }
    
    /**
     * 
     * @returns {boolean}
     */
    start() {
        this.looping = true
        this.cycle()
        return true
    }


}