const { Client, Interaction } = require("discord.js")
const interactionButtons = require("../handlers/interactionButtons")
const interactionCommands = require("../handlers/interactionCommands")

/**
 * 
 * @param {Client} client 
 * @param {Interaction} interaction 
 */
module.exports = (client, interaction) => {
    if (interaction.isCommand()) {
        interactionCommands(client, interaction)
    } else if (interaction.isMessageComponent()) {
        interactionButtons(client, interaction)
    }
}