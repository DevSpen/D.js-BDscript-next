const { Client, CommandInteraction } = require("discord.js");
const Interpreter = require("../main/Interpreter");
const Bot = require("../structures/Bot");

/**
 * 
 * @param {Client} client 
 * @param {CommandInteraction} interaction 
 */
module.exports = (client, interaction) => {
    /**
     * @type {Bot}
     */
    const bot = client.bot 

    const commands = bot.commands.onSlashInteraction 

    if (!commands.size) return undefined

    interaction.author = interaction.user

    for (const command of commands.array()) {
        Interpreter(client, {
            client, 
            command,
            message: interaction,
            mainChannel: interaction.channel,
            channel: interaction.channel,
            args: [],
            extras: {
                options: interaction.options,
                interaction 
            }
        })
    }
}