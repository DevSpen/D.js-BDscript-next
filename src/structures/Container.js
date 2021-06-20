const { MessageEmbed, Webhook, TextChannel, DMChannel, CommandInteraction, Message, MessageActionRow, User } = require("discord.js")
const { day } = require("ms-utility/src/util/Container")
const CommandAdapter = require("./CommandAdapter")

module.exports = class Container {
    /**
     * 
     * @param {CommandAdapter} command 
     */
    constructor(command) {
        if (command) this._patch(command)
    }

    /**
     * 
     * @param {CommandAdapter} data 
     */
    _patch(data) {
        /**
         *  
         * @type {number} 
         */
        this.startedTimestamp = Date.now()
    
        /**
         * @type {string}
         */
        this.content = data.compiled.code 
        
        /**
         * @type {Object<string, any>}
         */
        this.data = {}

        /**
         * @type {MessageActionRow[]}
         */
        this.components = []

        /**
         * @type {MessageEmbed[]}
         */
        this.embeds = []

        this.referenceChannel = null

        /**
         * @type {import("../util/Constants").ReplyOptions}
         */
        this.replyOptions = {
            isReply: false,
            isReplyWaiting: false,
            isReplyEphemeral: false,
            replyType: null
        }
    }

    addData(data, name) {
        if (name) {
            this.data[name] = data
            return this.data
        }
        this.data = Object.assign(this.data, data)
        return this.data
    }

    /**
     * 
     * @param {Webhook|TextChannel|DMChannel|CommandInteraction|Message|User} channel  
     */
    setChannel(channel) {
        this.referenceChannel = channel
    }

    /**
     * @param {?string} content
     * @returns {Promise<?Message>}
     * @param {Webhook|TextChannel|DMChannel|CommandInteraction|Message|User} channel  
     */
    async execute(content, channel) {
        if (!this.referenceChannel) return undefined

        const m = await (channel ?? this.referenceChannel)[this.sendOption]?.({
            content,
            embeds: this.embeds,
            components: this.components
        }).catch(() => null)

        this.components = []
        this.embeds = []
        this.replyOptions.isReply = false
        this.replyOptions.isReplyEphemeral = false
        this.replyOptions.isReplyWaiting = false
        this.replyOptions.replyType = null

        return m
    }

    get sendOption() {
        return this.replyOptions.replyType ?? "send"
    }
}