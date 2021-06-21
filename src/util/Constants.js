const { Client, ClientOptions, DMChannel, TextChannel, Webhook, Message, User, Intents, Collection, Guild, Role, GuildMember } = require("discord.js")
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
 * @param {GuildMember} member  
 * @returns {string}
 */
 function memberFunc (member) {}

/**
 * @typedef {Object} MemberPropertyData 
 * @property {string} description
 * @property {memberFunc} code 
 */
  
/**
 * @type {Object<string, MemberPropertyData>}
 */
exports.MemberProperties = {
    guildID: {
        description: "the guild this member is in",
        code: m => m.guild.id
    },
    nickname: {
        description: "the nickname of this user, if any.",
        code: m => m.nickname
    },
    displayName: {
        description: "the nick of name of this user.",
        code: m => m.displayName
    },
    joinedTimestamp: {
        description: "the time this member joined this server in ms.",
        code: m => m.joinedTimestamp
    },
    id: {
        description: "the id of this user.",
        code: m => m.id
    },
    hexColor: {
        description: "the user's highest role hex color.",
        code: m => m.displayHexColor
    },
    color: {
        description: "the user's highest role int color.", 
        code: m => m.displayColor
    },
    highestRoleID: {
        description: "the user's highest role ID.",
        code: m => m.roles.highest.id
    },
    roles: {
        description: "the role IDs of this user.",
        code: m => m.roles.cache.map(r => r.id).join(", ")
    }
}

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
    members: {
        code: r => r.members.map(m => m.id).join(", "),
        description: "returns cached member IDs with this role."
    },
    mention: {
        code: r => r.toString(),
        description: "returns this role as mention format."
    }
}

/**
 * 
 * @param {Client} client  
 * @returns {string}
 */
 function clientFunc (client) {}

/**
 * @typedef {Object} ClientPropertyData 
 * @property {string} description 
 * @property {clientFunc} code 
 */
  
 /**
 * @type {Object<string, ClientPropertyData>}
 */
exports.ClientProperties = {
    id: {
        description: "the id of the client.",
        code: c => c.user.id
    },
    users: {
        description: "the cached user IDs.",
        code: c => c.users.cache.map(c => c.id).join(", ")
    },
    guilds: {
        description: "the guild IDs this bot is in.",
        code: c => c.guilds.cache.map(c => c.id).join(", ")
    },
    channels: {
        description: "the channel IDs of all guilds",
        code: c => c.channels.cache.map(c => c.id).join(", ")
    },
    emojis: {
        description: "the emoji IDs of all guilds.",
        code: c => c.emojis.cache.map(e => e.id).join(", ")
    },
    owners: {
        description: "the owner IDs of this application.",
        code: async c => {
            const app = await c.application.fetch()
            if (app.owner instanceof User) {
                return app.owner.id
            } else {
                return app.owner.members.map(m => m.id).join(", ")
            }
        }
    }
}

/**
 * 
 * @param {TextChannel} channel   
 * @returns {string}
 */
 function channelFunc (channel) {}

/**
 * @typedef {Object} ChannelPropertyData 
 * @property {string} description 
 * @property {channelFunc} code 
 */
  
 /**
 * @type {Object<string, ChannelPropertyData>}
 */
exports.ChannelProperties = {
    name: {
        code: c => c.name,
        description: "the name of this channel."
    },
       createdTimestamp: {
        code: c => c.createdTimestamp,
        description: "The timestamp when this channel was created, in milliseconds."
    },
    id: {
        code: c => c.id,
        description: "This is useless."
    },
    type: {
        code: c => c.type,
        description: "The channel type."
    },
    deleteable: {
        code: c => c.deletable,
        description: "Returns whether the bot can delete this channel or not."
    },
    manageable: {
        code: c => c.manageable,
        description: "Returns whether the bot can edit this channel or not."
    },
     parentID: {
        code: c => c.parentID,
        description: "Returns the ID of the category that this channel belongs to."
    },
    position: {
        code: c => c.position,
        description: "The position of this channel."
    },
     viewable: {
        code: c => c.viewable,
        description: "Whether or not this channel is viewable by the bot."  
     },
     slowmode: {
        code: c => c.rateLimitPerUser,
        description: "The slowmode of this channel in seconds."  
     },
     nsfw: {
        code: c => c.nsfw,
        description: "Whether this channel is NSFW or not."  
     },
     lastPinTimestamp: {
        code: c => c.lastPinTimestamp,
        description: "The timestamp when the last pinned message was pinned, in milliseconds."  
     },
     lastMessageID: {
        code: c => c.lastMessageID,
        description: "Returns the latest message ID of this channel."  
     },
     topic: {
        code: c => c.topic,
        description: "Returns this channel's topic."  
     },
     typing: {
        code: c => c.typing,
        description: "Whether or not the typing indicator is being shown in the channel."  
     },
     bitrate: {
        code: c => c.bitrate,
        description: "The bitrate of this channel."  
     },
     full: {
        code: c => c.full,
        description: "Whether or not this channel is full."  
     },
     joinable: {
        code: c => c.joinable,
        description: "Whether or not this channel is joinable by the bot."  
     },
     speakable: {
        code: c => c.speakable,
        description: "Whether or not the bot can speak in this channel."  
     },
     userLimit: {
        code: c => c.userLimit,
        description: "The maximum amount of users allowed in this channel. 0 means unlimited."  
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
    afkChannelID: {
        description: "The server's AFK channel ID.",
        code: (s) => s.afkChannelID
    },
    afkTimeout: {
        description: "The server's AFK timeout.",
        code: (s) => s.afkTimeout
    },
    available: {
        description: "Whether the server is available to access. If it is not available, it indicates a server outage.",
        code: (s) => s.available
    },
    defaultMessageNotifications: {
        description: "Returns this server's default message notifactions setting.",
        code: (s) => s.defaultMessageNotifications
    },
    description: {
        description: "Returns this server's description.",
        code: (s) => s.description
    },
    explicitContentFilter: {
        description: "Returns this server's explicit content filter.",
        code: (s) => s.explicitContentFilter
    },
    name: {
        name: "This server's name.",
        code: (s) => s.name
    },
    mfaLevel: {
        name: "This server's MFA level.",
        code: (s) => s.mfaLevel
    },
   ownerID: {
        name: "This server's owner ID.",
        code: (s) => s.ownerID
    },
   isPartnered: {
        name: "Whether or not this server is a Discord Partner",
        code: (s) => s.partnered
    }, 
   preferredLocale: {
        name: "This server's preferred locale.",
        code: (s) => s.preferredLocale
    },
   premiumSubscriptionCount: {
        name: "This server's boost count.",
        code: (s) => s.premiumSubscriptionCount
    }, 
   premiumTier: {
        name: "This server's boost level.",
        code: (s) => s.premiumTier
    }, 
    publicUpdatesChannelID: {
        name: "This server's public updates channel ID.",
        code: (s) => s.publicUpdatesChannelID
    }, 
    region: {
        name: "This server's region.",
        code: (s) => s.region
    }, 
    rulesChannelID: {
        name: "This server's rules channel ID.",
        code: (s) => s.rulesChannelID
    },
    systemChannelID: {
        name: "This server's system channel ID.",
        code: (s) => s.systemChannelID
    }, 
    verificationLevel: {
        name: "This server's verification level.",
        code: (s) => s.verificationLevel
    },
        verified: {
        name: "Returns whether or not this server is verified by Discord.",
        code: (s) => s.verified
    }, 
        widgetChannelID: {
        name: "This server's widget channel ID.",
        code: (s) => s.widgetChannelID
    }, 
        isWidgetEnabled: {
        name: "Returns whether or not widgets are enabled for this server.",
        code: (s) => s.widgetEnabled
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
    },
    createdTimestamp: {
        code: u => u.createdTimestamp,
        description: "the time this user created this account in ms."
    },
    lastMessageChannelID: {
        code: u => u.lastMessageChannelID,
        description: "The user's last message channel ID."
    },
    lastMessageID: {
        code: u => u.lastMessageID,
        description: "The user's last message ID."
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
    $client: {
        key: "$client",
        isProperty: false,
        returns: "ANY",
        description: "retrieve info from the client.",
        params: [
            {
                name: "property",
                type: "STRING",
                resolveType: "STRING",
                description: "the property or data to get from the client.",
                required: true, 
            }
        ],
        emptyReturn: true
    },
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
    $member: {
        key: "$member",
        isProperty: false,
        returns: "ANY",
        description: "retrieve info from given member ID.",
        params: [
            {
                name: "guildID",
                description: "the guild where this member is in",
                type: "STRING",
                resolveType: "GUILD",
                required: true
            },
            {
                name: "userID",
                type: "STRING",
                resolveType: "MEMBER",
                description: "the member to retrieve info of.",
                required: true,
                source: 0 
            },
            {
                name: "property",
                type: "STRING",
                resolveType: "STRING",
                description: "the property or data to get from this member.",
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
    $if: {
        key: "$if",
        description: "makes an if statement.",
        isProperty: false,
        returns: "ANY",
        emptyReturn: true,
        params: [
            {
                name: "condition",
                description: "the condition to test.",
                type: "STRING",
                resolveType: "STRING",
                required: true
            },
            {
                name: "ifCode",
                description: "code to execute if condition is true.",
                type: "STRING",
                resolveType: "STRING",
                required: true
            },
            {
                name: "elseCode",
                description: "code to execute if the condition is false.",
                type: "STRING",
                resolveType: "STRING",
                required: false
            }
        ]
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
            },
            {
                name: "return message ID",
                description: "whether to return the newly sent message's ID",
                type: "BOOLEAN",
                resolveType: "BOOLEAN",
                default: false,
                required: false
            }
        ]
    },
    $parseTime: {
        key: "$parseTime", 
        isProperty: false,
        description: "converts ms to time string.",
        returns: "STRING",
        params: [
            {
                name: "ms",
                description: "the ms to convert.",
                type: "NUMBER",
                resolveType: "NUMBER",
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
    $description: {
        key: "$description",
        description: "set an embed description to given embed index.",
        returns: "NONE",
        params: [
            {
                name: "index",
                resolveType: "NUMBER",
                type: "NUMBER",
                description: "the index of the embed to add this data to.",
                required: true
            },
            {
                name: "text",
                resolveType: "STRING",
                type: "STRING",
                required: false,
                description: "the description to add to this embed.",
            }
        ]
    },
    $title: {
        key: "$title",
        description: "set an embed title to given embed index.",
        returns: "NONE",
        params: [
            {
                name: "index",
                resolveType: "NUMBER",
                type: "NUMBER",
                description: "the index of the embed to add this data to.",
                required: true
            },
            {
                name: "text",
                resolveType: "STRING",
                type: "STRING",
                required: false,
                description: "the title to add to this embed.",
            },
            {
                name: "url",
                resolveType: "STRING",
                type: "STRING",
                required: false,
                description: "the url to add to this embed title.",
            }
        ]
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
 * @property {boolean} returnContainer
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

module.exports.OPERATORS = [
    "<=", ">=", "!=", "==", ">", "<"
]

/**
 * 
 * @param {any} value1 
 * @param {string} operator 
 * @param {any} value2 
 */
module.exports.condition = (value1, operator, value2) => {
    if ([
        "<=",
        ">=",
        ">",
        "<"
    ].includes(operator)) {
        value2 = Number(value2)
        value1 = Number(value1)
    }

    if (operator === "!=") {
        if (value1 === value2) return false
    } else if (operator === "==") {
        if (value1 !== value2) return false
    } else if (operator === "<") {
        if (value1 >= value2) return false
    } else if (operator === ">") {
        if (value1 <= value2) return false
    } else if (operator === ">=") {
        if (value1 < value2) return false
    } else if (operator === "<=") {
        if (value1 > value2) return false 
    }

    return true
}
