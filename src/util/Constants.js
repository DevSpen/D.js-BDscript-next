const { Client, ClientOptions, DMChannel, TextChannel, Webhook, Message, User, Intents, Collection, Guild, Role } = require("discord.js")
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
 * 
 * @param {Role} role 
 * @returns {string}
 */
 function roleFunc (role) {}

/**
 * @typedef {Object} RolePropertyData 
 * @property {string} description
 * @property {roleFunc} code 
 */
  
/**
 * @type {Object<string, RolePropertyData>}
 */
exports.RoleProperties = {
    name: {
        code: (r) => r.name,
        description: "the name of this role."
    },
    id: {
        code: (r) => r.id,
        description: "the id of this role."
    },
    position: {
        code: r => r.position,
        description: "the position of this role."
    },
    isEveryoneRole: {
        code: (r) => r.id === r.guild.id,
        description: "whether this role is the @everyone role for this guild."
    },
    isMentionable: {
        code: r => r.mentionable,
        description: "whether the role is mentionable."
    },
    mention: {
        code: r => r.toString(),
        description: "returns this role as mention format."
    }
}

/**
 * 
 * @param {Guild} guild  
 * @returns {string}
 */
function serverFunc (guild) {}

/**
 * @typedef {Object} ServerPropertyData 
 * @property {string} description
 * @property {serverFunc} code 
 */
 
/**
 * @type {Object<string, ServerPropertyData>}
 */
exports.ServerProperties = {
    id: {
        description: "the id for this guild.",
        code: (s) => s.id
    },
    emojis: {
        description: "returns all the emote IDs for this guild.",
        code: (s) => s.emojis.cache.map(e => e.id).join(", ")
    },
    roles: {
        description: "returns all the role IDs for this guild.",
        code: (s) => s.roles.cache.map(r => r.id).join(", ")
    },
    members: {
        description: "returns all cached member IDs for this guild.",
        code: (s) => s.members.cache.map(e => e.id).join(", ")
    },
    memberCount: {
        description: "approximated member count for this guild",
        code: (s) => s.memberCount ?? 0 
    },
    channels: {
        description: "returns all the channel IDs for this guild.",
        code: (s) => s.channels.cache.map(e => e.id).join(", ")
    }
}

/**
 * 
 * @param {User} user 
 * @returns {string}
 */
function userFunc (user) {}

/**
 * @typedef {Object} UserPropertyData 
 * @property {string} description
 * @property {userFunc} code 
 */

/**
 * @type {Object<string, UserPropertyData>}
 */
exports.UserProperties = {
    id: {
        code: (u) => u.id, 
        description: "the ID of this user.",
    },
    username: {
        code: (u) => u.username,
        description: "the user's username."
    },
    tag: {
        code: (u) => u.tag,
        description: "the user's username and discriminator altoghether."
    },
    discriminator: {
        code: (u) => u.discriminator,
        description: "the user's discriminator."
    },
    avatar: {
        code: (u) => u.displayAvatarURL({
            size: 2048
        }),
        description: "the user's avatar url."
    },
    bot: {
        code: (u) => u.bot,
        description: "whether this user is a bot account."
    },
    badges: {
        code: (u) => u.flags?.toArray().join(", "),
        description: "the badges this user has."
    }
}

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
    $user: {
        key: "$user",
        isProperty: false,
        returns: "ANY",
        description: "retrieve info from given user ID.",
        params: [
            {
                name: "userID",
                description: "the user to get info of",
                type: "STRING",
                resolveType: "USER",
                required: true
            },
            {
                name: "property",
                type: "STRING",
                resolveType: "STRING",
                description: "the property or data to get from this user.",
                required: true, 
            }
        ],
        emptyReturn: true
    },
    $role: {
        key: "$role",
        isProperty: false,
        returns: "ANY",
        description: "retrieve info from given role ID.",
        params: [
            {
                name: "guildID",
                description: "the guild where this role is in",
                type: "STRING",
                resolveType: "GUILD",
                required: true
            },
            {
                name: "roleID",
                type: "STRING",
                resolveType: "ROLE",
                description: "the role to retrieve info of.",
                required: true,
                source: 0 
            },
            {
                name: "property",
                type: "STRING",
                resolveType: "STRING",
                description: "the property or data to get from this role.",
                required: true, 
            }
        ],
        emptyReturn: true
    },
    $server: {
        key: "$server",
        returns: "ANY", 
        isProperty: false,
        description: "retrieve info from given guild ID.",
        params: [
            {
                name: "guildID",
                description: "the guild to get info of",
                type: "STRING",
                resolveType: "GUILD",
                required: true
            },
            {
                name: "property",
                type: "STRING",
                resolveType: "STRING",
                description: "the property or data to get from this guild.",
                required: true, 
            }
        ],
        emptyReturn: true
    },
    $authorID: {
        key: "$authorID",
        description: "returns the author ID",
        returns: "STRING",
        isProperty: true
    },
    $data: {
        key: "$data",
        description: "return assigned data from a function or callback.",
        returns: "ANY",
        emptyReturn: true,
        isProperty: false,
        params: [
            {
                name: "property",
                description: "property to get data from",
                required: true,
                resolveType: "STRING",
                type: "STRING"
            }
        ]
    },
    $forEach: {
        key: "$forEach",
        description: "loops over given elements with a separator.",
        isProperty: false,
        params: [
            {
                name: "elements",
                description: "element or elements to loop through.",
                type: "STRING",
                required: true,
                resolveType: "STRING"
            },
            {
                name: "separator",
                type: "ANY",
                resolveType: "STRING",
                description: "the separator to split the elements by",
                required: true
            },
            {
                name: "code",
                type: "STRING",
                resolveType: "STRING",
                description: "the code used to execute for each element, $data[value] will contain the element for each loop lap.",
                required: true
            },
            {
                name: "separator",
                resolveType: "STRING",
                description: "the separator that will be used to separate each lap output.",
                required: false,
                default: ", ",
                type: "ANY"
            }
        ],
        emptyReturn: true, 
        returns: "ANY"
    },
    $guildID: {
        key: "$guildID",
        description: "returns the guild ID",
        returns: "STRING",
        isProperty: true
    },
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
        emptyReturn: true, 
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
 * @property {boolean} emptyReturn 
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
 * @typedef {import("..").CommandTypes} CommandTypes
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

/**
 * Available regexes.
 */
module.exports.REGEXES = {
    /**
     * @type {RegExp}
     */
    ID: /^(\d{17,19})$/
}