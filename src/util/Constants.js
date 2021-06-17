const { Client, ClientOptions, DMChannel, TextChannel, Webhook, Message, User, Intents, Collection } = require("discord.js")
const Interpreter = require("../main/Interpreter")
const CommandAdapter = require("../structures/CommandAdapter")
const CompileData = require("../structures/CompileData")
const Container = require("../structures/Container")

exports.DefaultBotOptions = {
    client: {
        intents: Intents.ALL
    }
}

exports.AvailableCommandTypes = createEnum([
    "basicCommand",
    "readyCommand"
])

exports.CommandToEvent = {
    basicCommand: "onMessage",
    readyCommand: "onReady"
}

exports.EventModules = {
    onMessage: "../events/message",
    onReady: "../events/ready"
}

exports.AvailableEventTypes = createEnum([
    "onMessage",
    "onReady"
])

/**
 * @typedef {Object} BotOptions
 * @property {ClientOptions} client 
 * @property {string[]|string} prefix
 * @property {?string} token
 */

/**
 * @typedef {Object} Commands 
 * @property {Collection<string, CommandAdapter>} onMessage 
 * @property {Collection<string, CommandAdapter>} onReady
 */

/**
 * @type {Object<string, Prototype>}
 */
module.exports.Functions = {
    $sum: {
        key: "$sum",
        description: "sum multiple numbers.",
        params: [
            {
                name: "numbers",
                description: "numbers to sum, separated by `;`.",
                type: "NUMBER",
                required: true,
                rest: true, 
                resolveType: "NUMBER"
            }
        ],
        isProperty: false,
        returns: "NUMBER",
        brackets: {
            open: "[",
            close: "]"
        }
    },
    $dateStamp: {
        key: "$dateStamp",
        isProperty: true,
        description: "returns date since 1970 in ms.",
        returns: "NUMBER"
    },
    $sendMessage: {
        key: "$sendMessage",
        isProperty: false,
        returns: "NONE",
        description: "sends a message to given channel.",
        params: [
            {
                name: "channelID",
                type: "STRING",
                description: "the channel to send this message to",
                required: true,
                resolveType: "CHANNEL"
            }, 
            {
                name: "message",
                description: "the message to send to this channel.",
                type: "STRING",
                required: true
            }
        ]
    },
    $executionTime: {
        isProperty: true,
        key: "$executionTime",
        description: "returns command execution time",
        returns: "NUMBER"
    },
    $channelID: {
        isProperty: true,
        key: "$channelID",
        returns: "STRING",
        description: "returns the current channel's ID"
    },
    $message: {
        key: "$message",
        isProperty: false,
        optional: true,
        params: [
            {
                name: "arg number",
                description: "the user argument to return.",
                required: true,
                type: "NUMBER",
                resolveType: "NUMBER"
            }
        ],
        returns: "STRING",
        description: "gets user arguments from this command"
    },
    $eval: {
        key: "$eval",
        description: "evals a code.",
        isProperty: false,
        optional: true,
        returns: "NONE",
        params: [
            {
                name: "code",
                description: "the code to eval",
                type: "STRING",
                resolveType: "STRING",
                required: true
            }
        ]
    }
}

/**
 * @typedef {Object} Brackets
 * @property {string} open 
 * @property {string} close
 */

/**
 * @typedef {import("..").Types} Types 
 */

/**
 * @typedef {Object} Prototype
 * @property {string} key 
 * @property {?Types} returns
 * @property {boolean} isProperty
 * @property {string[]} examples 
 * @property {string} separator 
 * @property {Object<string, Brackets>} brackets
 * @property {boolean} disabled
 * @property {?Types} accepts 
 * @property {boolean} optional
 * @property {Param[]} params 
 * @property {string} description
 */

/**
 * 
 * @typedef {import("..").ResolveTypes} ResolveTypes
 */

/**
 * 
 * @typedef {Object} Param  
 * @property {Types} type 
 * @property {string} description
 * @property {string} name
 * @property {any} default 
 * @property {boolean} rest 
 * @property {ResolveTypes} resolveType
 * @property {number} source 
 * @property {boolean} required
 */

/**
 * @typedef {Object} CompiledObject
 * @property {string} code
 * @property {CompileData[]} functions
 */

/**
 * @typedef {Object} CommandData 
 * @property {?string} name
 * @property {?string[]} aliases
 * @property {string} code 
 * @property {CommandTypes} type
 */

/**
 * @typedef {Object} ReplyOptions 
 * @property {boolean} isReply
 * @property {boolean} isReplyEphemeral
 * @property {boolean} isReplyWaiting
 * @property {?string} replyType
 */

/**
 * @typedef {Object} ExecutionData 
 * @property {CommandAdapter} command 
 * @property {Container} container
 * @property {string[]} args 
 * @property {Message} message
 * @property {Client} client 
 * @property {TextChannel|DMChannel|User|Webhook|Message} mainChannel 
 * @property {TextChannel|DMChannel|User|Webhook|Message} channel
 */

/**
 * 
 * @param {*} arr 
 * @returns 
 */
function createEnum(arr) {
    const obj = {}
    for (let i = 0;i < arr.length;i++) {
        const v = arr[i]
        obj[v] = i 
        obj[i] = v 
    }
    return obj
}