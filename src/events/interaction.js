const { Client, Interaction } = require("discord.js")
const interactionCommands = require("../handlers/interactionCommands")

/**
 * 
 * @param {Client} client 
 * @param {Interaction} interaction 
 */
module.exports = (client, interaction) => {
    if (interaction.isCommand()) {
        interactionCommands(client, interaction)
    } 
}