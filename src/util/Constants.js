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
        returns: "NUMBER"
    },
    $sendMessage: {
        key: "$sendMessage",
        isProperty: false,
        returns: "NONE",
    },
    $channelID: {
        isProperty: true,
        key: "$channelID",
        returns: "STRING"
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
 * @property {string} separator 
 * @property {Object<string, Brackets>} brackets
 * @property {boolean} disabled
 * @property {?Types} accepts 
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