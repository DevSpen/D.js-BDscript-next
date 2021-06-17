const { Client, Message } = require("discord.js");
const Interpreter = require("../main/Interpreter");
const Bot = require("../structures/Bot");

/**
 * 
 * @param {Client} client 
 * @param {Message} message 
 */
module.exports = async (client, message) => {
    /**
     * @type {Bot}
     */
    const bot = client.bot
    
    const commands = bot.commands.onMessage  

    if (commands.size === 0) return undefined

    let prefix; 

    for (const pr of bot.options.prefix) {
        if (message.content.toLowerCase().startsWith(pr)) {
            prefix = pr
            break
        }
    }

    if (!prefix) return undefined

    const args = message.content.slice(prefix.length).trim().split(/ +/)

    const cmd = args.shift().toLowerCase()

    const cmds = commands.filter(c => c.data.name === cmd || (c.data.aliases?.includes(cmd)))

    if (!cmds.size) return undefined

    for (const cmd of cmds.array()) {
        await Interpreter(client, {
            message,
            args,
            command: cmd,
            client
        })
    }
}