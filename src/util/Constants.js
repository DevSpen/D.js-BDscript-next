const { VoiceConnection, AudioPlayer, PresenceStatus, PlayerSubscription } = require("@discordjs/voice")
const { Client, ClientOptions, DMChannel, CommandInteractionOption, TextChannel, Webhook, Message, User, Intents, Collection, Guild, Role, GuildMember, Interaction, CommandInteraction, MessageComponentInteraction, VoiceChannel, Presence } = require("discord.js")
const Interpreter = require("../main/Interpreter")
const Bot = require("../structures/Bot")
const CommandAdapter = require("../structures/CommandAdapter")
const CompileData = require("../structures/CompileData")
const Container = require("../structures/Container")
const Track = require("../structures/Track")

module.exports.DefaultBotOptions = {
    client: {
        intents: Intents.ALL
    },
    databasePath: "./db.sqlite"
}

module.exports.AvailableCommandTypes = createEnum([
    "basicCommand",
    "readyCommand",
    "slashCommand",
    "buttonCommand",
    "musicEndCommand",
    "musicStartCommand"
])

module.exports.CommandToEvent = {
    basicCommand: "onMessage",
    readyCommand: "onReady",
    slashCommand: "onSlashInteraction",
    musicEndCommand: "onMusicEnd",
    musicStartCommand: "onMusicStart", 
    buttonCommand: "onButtonInteraction"
}

module.exports.EventModules = {
    onMessage: "../events/message",
    onReady: "../events/ready",
    onInteraction: "../events/interaction",
    onSlashInteraction: "../events/interaction",
    onButtonInteraction: "../events/interaction",
    onMusicEnd: "../events/guildMusicEnd",
    onMusicStart: "../events/guildMusicStart", 
}

module.exports.AvailableEventTypes = createEnum(Object.keys(exports.EventModules))

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
module.exports.MemberProperties = {
    guildID: {
        description: "the guild this member is in",
        code: m => m.guild.id
    },
    voiceChannelID: {
        description: "returns the voice channel ID of this member, if any",
        code: m => m.voice.channelID
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
module.exports.RoleProperties = {
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
module.exports.ClientProperties = {
  id: {
        description: "the id of the client.",
        code: c => c.user.id
    },
  token: {
        description: "The client's token. Use this property with caution!",
        code: c => c.token
    },
  tag: {
        description: "The bot's tag (User#0000).",
        code: c => c.user.tag
    },
   uptime: {
        description: "How long it has been since the client last was ready in milliseconds.",
        code: c => c.uptime
    },
   discriminator: {
        description: "The bot's discrmnator.",
        code: c => c.user.discriminator
    },
   username: {
        description: "The bot's username.",
        code: c => c.user.username
    },
   ping: {
        description: "The bot's ping in milliseconds.",
        code: c => c.ws.ping
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
    commands: {
        description: "returns all global slash commands.",
        code: async c => {
            const cmds = await c.application.commands.fetch()
            return cmds.map(c => c.id).join(", ")
        }
    },
    guildCount: {
        description: "the guild count.",
        code: c => c.guilds.cache.size  
    },
    userCount: {
        description: "the total user count.",
        code: c => c.users.cache.size  
    },
    botCount: {
        description: "the total bot count.",
        code: c => c.users.cache.filter(c => c.bot).size  
    },
    channelCount: {
        description: "the total channel count.",
        code: c => c.channels.cache.size
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
module.exports.ChannelProperties = {
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
module.exports.ServerProperties = {
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
    },
    commands: {
        description: "returns all the slash command IDs for this guild.",
        code: async (g) => {
            const cmds = await g.commands.fetch()
            return cmds.map(c => c.id).join(", ")
        }
    },
    bans: {
        description: "returns all banned user IDs for this guild.",
        code: async g => {
            const data = await g.bans.fetch().catch(() => null)
            return data ? data.map(s => s.user.id).join(", ") : undefined
        }
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
module.exports.UserProperties = {
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
 * @property {?string} databasePath
 * @property {?string} token
 */

/**
 * @typedef {Object} Commands 
 * @property {Collection<string, CommandAdapter>} onMessage 
 * @property {Collection<string, CommandAdapter>} onMusicStart
 * @property {Collection<string, CommandAdapter>} onMusicEnd
 * @property {Collection<string, CommandAdapter>} onReady
 * @property {Collection<string, CommandAdapter>} onSlashInteraction
 * @property {Collection<string, CommandAdapter>} onButtonInteraction
 */

/**
 * @type {Object<string, Prototype>}
 */
module.exports.Functions = {
    $getVar: {
        key: "$getVar",
        description: "gets a variable value from given id and type.",
        isProperty: false,
        returns: "ANY",
        emptyReturn: true,
        params: [
            {
                name: "variable",
                description: "the variable to get the value of",
                type: "STRING",
                required: true,
                resolveType: "STRING"
            },
            {
                name: "id",
                description: "the id that was set to this variable.",
                type: "STRING",
                required: true,
                resolveType: "STRING"
            },
            {
                name: "type",
                description: "optional type for more accurate matching, incase 2 objects have the same ID.",
                required: true,
                resolveType: "STRING",
                type: "STRING"
            }
        ]
    },
    $slashOption: {
        key: "$slashOption",
        description: "retrieves user value on a slash option.",
        returns: "ANY",
        emptyReturn: true,
        params: [
            {
                name: "option name",
                description: "the option name to get the value of.",
                type: "STRING",
                resolveType: "STRING",
                required: true
            }
        ]
    },
    $updateCommands: {
        key: "$updateCommands",
        description: "updates all commands that were loader through the command manager.",
        isProperty: true,
        returns: "NONE"
    },
    $setVar: {
        key: "$setVar",
        description: "sets a variable value to given id and type.",
        isProperty: false,
        returns: "NONE",
        params: [
            {
                name: "variable",
                description: "the variable to set the value to",
                type: "STRING",
                required: true,
                resolveType: "STRING"
            },
            {
                name: "value",
                description: "the value to set to this variable.",
                type: "ANY",
                required: true,
                resolveType: "STRING"
            },
            {
                name: "id",
                description: "the object id to set this var value to.",
                type: "STRING",
                required: true,
                resolveType: "STRING"
            },
            {
                name: "type",
                description: "optional type for more accurate matching, incase 2 objects have the same ID.",
                required: true,
                resolveType: "STRING",
                type: "STRING"
            }
        ]
    },
    $numberSeparator: {
        key: "$numberSeparator",
        description: "separates thousands in the number.",
        returns: "NUMBER",
        params: [
            {
                name: "number",
                description: "the number to separate thousands of.",
                type: "NUMBER",
                resolveType: "NUMBER",
                required: true
            }
        ]
    },
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
    $interactionID: {
        key: "$interactionID",
        description: "returns the component's custom ID.",
        returns: "STRING",
        emptyReturn: true,
        isProperty: true
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
    $addButton: {
        key: "$addButton",
        isProperty: false,
        params: [
            {
                name: "link | customID",
                description: "the url or custom ID to set to this button.",
                type: "STRING",
                resolveType: "STRING",
                required: true
            },
            {
                name: "label",
                description: "the text for this button.",
                required: true,
                type: "STRING",
                resolveType: "STRING"
            },
            {
                name: "style",
                description: "the type of this button.",
                required: true,
                type: "STRING",
                resolveType: "STRING" 
            },
            {
                name: "emoji",
                description: "the emoji for this button.",
                type: "STRING",
                resolveType: "STRING",
                required: false,
                default: ""
            },
            {
                name: "disabled",
                default: "whether this button should appear disabled.",
                type: "BOOLEAN",
                resolveType: "BOOLEAN",
                required: false,
                default: false
            }
        ],
        returns: "NONE",
        description: "adds a button to the last action row.",
    },
    $addActionRow: {
        key: "$addActionRow",
        description: "add an action row.",
        isProperty: true,
        returns: "NONE"
    },
    $wait: {
        key: "$wait",
        description: "stops code execution for given time.",
        isProperty: false,
        returns: "NONE",
        emptyReturn: true,
        params: [
            {
                name: "time",
                description: "the amount of time to stop code execution.",
                type: "STRING",
                resolveType: "TIME",
                required: true
            }
        ]
    },
    $defer: {
        key: "$defer",
        description: "defers the interaction response.",
        isProperty: false,
        returns: "NONE",
        emptyReturn: true,
        params: [
            {
                name: "ephemeral",
                description: "whether the response will be ephemeral.",
                type: "BOOLEAN",
                resolveType: "BOOLEAN",
                required: true
            }
        ]
    },
    $exec: {
        key: "$exec",
        description: "executes a command in the powershell.",
        params: [
            {
                name: "command",
                description: "the command to execute",
                type: "STRING",
                resolveType: "STRING",
                required: true
            }
        ],
        isProperty: false,
        returns: "ANY",
        emptyReturn: true
    },
    $ephemeral: {
        returns: "NONE",
        emptyReturn: true,
        isProperty: true,
        description: "makes this interaction response ephemeral.",
        key: "$ephemeral"
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
        description: "Returns the sum of the provided numbers.",
        params: [
            {
                name: "numbers",
                description: "The numbers to add, separated by `;`.",
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
      $sub: {
        key: "$sub",
        description: "Substracts the provided numbers.",
        params: [
            {
                name: "numbers",
                description: "The number to subtract, separated by `;`.",
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
     $multi: {
        key: "$multi",
        description: "Multiplies the provided numbers.",
        params: [
            {
                name: "numbers",
                description: "The numbers to multiply, separated by `;`.",
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
      $divide: {
        key: "$divide",
        description: "Divides the provided numbers.",
        params: [
            {
                name: "numbers",
                description: "The numbers to divide, separated by `;`.",
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
       $modulo: {
        key: "$modulo",
        description: "Returns remainder between numbers.",
        params: [
            {
                name: "numbers",
                description: "The numbers, separated by `;`.",
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
    $messageID: {
        key: "$messageID",
        description: "the ID of this message.",
        returns: "STRING",
        emptyReturn: true,
        isProperty: true
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
    $color: {
        key: "$color",
        description: "set an embed color to given embed index.",
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
                name: "color",
                resolveType: "STRING",
                type: "STRING",
                required: false,
                description: "the color hex or int to add to this embed.",
            }
        ]
    },
    $replaceText: {
        key: "$replaceText",
        description: "replaces matches in text with something else.",
        isProperty: false,
        returns: "STRING",
        emptyReturn: true,
        params: [
            {
                name: "text",
                description: "the text to replace results from",
                type: "STRING",
                resolveType: "STRING",
                required: true 
            },
            {
                name: "match",
                description: "letter or word to replace",
                resolveType: "STRING",
                type: "STRING",
                required: true
            },
            {
                name: "to",
                description: "what to replace results to",
                type: "ANY",
                resolveType: "STRING",
                required: true 
            }
        ]
    },
    $checkCondition: {
        key: "$checkCondition",
        returns: "BOOLEAN",
        description: "checks whether a condition is true.",
        params: [
            {
                name: "condition",
                description: "the condition to check.",
                type: "ANY",
                resolveType: "STRING",
                required: true
            }
        ]
    },
    $onlyIf: {
        key: "$onlyIf",
        description: "checks whether a condition is true, returns a code if false.",
        emptyReturn: true,
        returns: "NONE",
        params: [
            {
                name: "condition",
                description: "condition to check for.",
                type: "STRING",
                resolveType: "STRING",
                required: true 
            }, 
            {
                name: "error message",
                description: "the message to execute if the condition is false.",
                type: "STRING",
                resolveType: "STRING",
                required: false
            }
        ]
    },
    $commandInfo: {
        key: "$commandInfo",
        description: "returns command info from given command.",
        isProperty: false,
        returns: "ANY",
        emptyReturn: true,
        params: [
            {
                name: "command type",
                description: "the type of the command, i.g `basicCommand`",
                type: "STRING",
                resolveType: "STRING",
                required: true
            }, 
            {
                name: "command name",
                description: "the name of the command",
                type: "STRING",
                resolveType: "STRING",
                required: true
            },
            {
                name: "property",
                description: "the property to return from this command",
                type: "STRING",
                resolveType: "STRING",
                required: true
            }
        ]
    },
    $addField: {
        key: "$addField",
        description: "set an embed field to given embed index.",
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
                name: "title",
                resolveType: "STRING",
                type: "STRING",
                required: false,
                description: "the field title to add to this embed.",
            },
            {
                name: "value",
                resolveType: "STRING",
                type: "STRING",
                required: false,
                description: "the value to add to this embed field.",
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
    $thumbnail: {
        key: "$thumbnail",
        description: "set an embed thumbnail to given embed index.",
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
                name: "url",
                resolveType: "STRING",
                type: "STRING",
                required: false,
                description: "the thumbnail to add to this embed.",
            }
        ]
    },
    $image: {
        key: "$image",
        description: "set an embed image to given embed index.",
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
                name: "url",
                resolveType: "STRING",
                type: "STRING",
                required: false,
                description: "the image url to add to this embed.",
            }
        ]
    },
    $attachment: {
        key: "$attachment",
        description: "add a file attachment to the response.",
        returns: "NONE",
        params: [
            {
                name: "name",
                resolveType: "STRING",
                type: "STRING",
                required: false,
                description: "the name of this attachment, must include the file extension.",
            },
            {
                name: "url",
                resolveType: "STRING",
                type: "STRING",
                required: false,
                description: "the url of this attachment.",
            }
        ]
    },
    $author: {
        key: "$author",
        description: "set an embed author to given embed index.",
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
                description: "the author title to add to this embed author.",
            },
            {
                name: "icon",
                resolveType: "STRING",
                type: "STRING",
                required: false,
                description: "the author icon to add to this embed author.",
            },
            {
                name: "hyperlink",
                resolveType: "STRING",
                type: "STRING",
                required: false,
                description: "the hyerlink url to add to this embed author.",
            }
        ]
    },
    $let: {
        key: "$let",
        description: "sets a variable value to a let variable.",
        returns: "NONE",
        emptyReturn: true,
        params: [
            {
                name: "variable",
                description: "the variable name.",
                required: true,
                resolveType: "STRING",
                type: "STRING"
            },
            {
                name: "value",
                description: "the value for this local variable.",
                type: "STRING",
                resolveType: "STRING",
                required: true
            }
        ]
    },
    $get: {
        key: "$get",
        description: "gets a value from a let variable.",
        returns: "ANY",
        emptyReturn: true,
        params: [
            {
                name: "variable",
                description: "the variable name.",
                required: true,
                resolveType: "STRING",
                type: "STRING"
            }
        ]
    },
    $footer: {
        key: "$footer",
        description: "set an embed footer to given embed index.",
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
                description: "the footer text to add to this embed.",
            },
            {
                name: "icon",
                resolveType: "STRING",
                type: "STRING",
                required: false,
                description: "the footer icon to add to this embed.",
            }
        ]
    },
    $joinVoice: {
        key: "$joinVoice",
        isProperty: false,
        description: "makes the bot join a voice channel.",
        params: [
            {
                name: "channel ID",
                description: "the voice channel to join to.",
                resolveType: "CHANNEL",
                type: "STRING",
                required: true
            }
        ]
    },
    $leaveVoice: {
        key: "$leaveVoice",
        isProperty: false,
        description: "makes the bot leave a voice channel.",
        params: [
            {
                name: "channel ID",
                description: "the voice channel to leave.",
                resolveType: "CHANNEL",
                type: "STRING",
                required: true
            }
        ]
    },
    $createSlashCommand: {
        key: "$createSlashCommand",
        description: "creates a global or guild slash command.",
        isProperty: false,
        returns: "STRING",
        emptyReturn: true,
        params: [
            {
                name: "guildID | global",
                description: "if global, the slash command will be available for every guild your bot is in, otherwise only available to given guild ID.",
                type: "STRING",
                resolveType: "STRING",
                required: true,
            },
            {
                name: "slash command name",
                description: "the slash command name that was created through ``Bot.createSlashCommandData()`.",
                type: "STRING",
                resolveType: "STRING",
                required: true
            },
            {
                name: "return command ID",
                description: "whether to return the newly created command's ID.",
                type: "BOOLEAN",
                resolveType: "BOOLEAN",
                required: false,
                default: false
            }
        ]
    }, 
    $reply: {
        key: "$reply",
        description: "whether this message is a reply.",
        emptyReturn: true,
        isProperty: false,
        optional: true,
        params: [
            {
                name: "mention",
                description: "whether to mention the user.",
                type: "BOOLEAN",
                resolveType: "BOOLEAN",
                required: true,
                default: false
            }
        ]
    },
    $log: {
        key: "$log",
        description: "prints something in the console.",
        emptyReturn: true,
        isProperty: false,
        returns: "NONE",
        params: [
            {
                name: "message",
                description: "the message to print.",
                type: "ANY",
                resolveType: "STRING",
                required: false,
                default: ""
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
    },
    $playSong: {
        key: "$playSong",
        description: "plays a song in a guild.",
        isProperty: false,
        returns: "BOOLEAN",
        emptyReturn: true,
        params: [
            {
                name: "guildID",
                description: "the guild to add this song to",
                type: "STRING",
                resolveType: "GUILD",
                required: true
            }, 
            {
                name: "song url",
                description: "the song to play.",
                type: "STRING",
                resolveType: "STRING",
                required: true 
            },
            {
                name: "isPlayingNow",
                description: "returns whether the bot is playing this song now.",
                type: "BOOLEAN",
                resolveType: "BOOLEAN",
                required: false,
                default: false
            }
        ]
    }
}

module.exports.loopTypes = createEnum([
    "NONE",
    "SONG",
    "QUEUE"
])

/**
 * @typedef {Object} VoiceData 
 * @property {Track[]} queue 
 * @property {AudioPlayer} player 
 * @property {Track[]} all 
 * @property {number} volume 
 * @property {PlayerSubscription} subscription
 * @property {Guild} guild 
 * @property {VoiceConnection} connection
 * @property {VoiceChannel} voice 
 * @property {TextChannel} channel 
 * @property {?Message} lastMessage 
 * @property {number} loopType  
 */

/**
 * @typedef {Object} TrackData 
 * @property {string} title 
 * @property {string} author 
 * @property {User} user 
 * @property {number} duration 
 * @property {string} thumbnail
 * @property {string} image 
 * @property {string} uri 
 * @property {string} url 
 */

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
 * @typedef {Object} StatusData 
 * @property {string} name the status name. 
 * @property {PresenceStatus} presence the status for this bot.
 * @property {number} duration status duration in ms.
 * @property {boolean} afk whether the client is afk. 
 * @property {number} shardID the shard to put this status on.
 * @property {string} url the stream url.
 * @property {string} type the type for this status
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
 * @property {?string} PATH_TO_FILE do not use this property.
 * @property {?string} name
 * @property {?string[]} aliases
 * @property {string} code 
 * @property {CommandTypes} type
 */

/**
 * @typedef {Object} ReplyOptions 
 * @property {boolean} isReply
 * @property {boolean} isReplyEphemeral
 * @property {boolean} replyMention 
 * @property {boolean} isReplyWaiting
 * @property {?string} replyType
 */

/**
 * @typedef {Object} ExtrasData 
 * @property {Track} track 
 * @property {Collection<string, CommandInteractionOption>} options
 * @property {CommandInteraction|MessageComponentInteraction} interaction 
 */

/**
 * @typedef {Object} ExecutionData 
 * @property {Bot} bot 
 * @property {ExtrasData} extras 
 * @property {CommandAdapter} command 
 * @property {Container} container
 * @property {string[]} args 
 * @property {Message|CommandInteraction|MessageComponentInteraction} message
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
