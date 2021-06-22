const { Client, MessageComponentInteraction } = require("discord.js");
const Interpreter = require("../main/Interpreter");
const Bot = require("../structures/Bot");

/**
 * 
 * @param {Client} client 
 * @param {MessageComponentInteraction} interaction 
 */
module.exports = (client, interaction) => {
    /**
     * @type {Bot}
     */
    const bot = client.bot 

    const commands = bot.commands.onButtonInteraction 

    if (!commands.size) return undefined

    interaction.author = interaction.user

    for (const command of commands.array()) {
        if (command.data.name !== undefined && interaction.customID !== command.data.name) {
            continue;
        }
        
        Interpreter(client, {
            client, 
            command,
            message: interaction,
            mainChannel: interaction.channel,
            channel: interaction.channel,
            args: [],
            extras: {
                interaction 
            }
        })
    }
}