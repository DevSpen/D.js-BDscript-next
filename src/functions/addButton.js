const { MessageActionRow, MessageButton } = require("discord.js");
const CompileData = require("../structures/CompileData");
const { ClientProperties } = require("../util/Constants");

/**
 * 
 * @param {CompileData} fn 
 * @param {import("../util/Constants").ExecutionData} d 
 */
module.exports = async (fn, d) => {
    const [
        linkOrCustomID,
        label,  
        style,
        emoji,
        disabled
    ] = await fn.resolveArray(d) ?? []

    if (linkOrCustomID === undefined) return undefined

    if (!d.container.components.length) return fn.sendError(`:x: No action row available to create a button in \`${fn.image}\``)

    const button = new MessageButton()

    if (style.toUpperCase() === "LINK") {
        button.setURL(linkOrCustomID)
    } else {
        button.setCustomID(linkOrCustomID)
    }

    button.setLabel(label)
    .setStyle(style.toUpperCase())
    .setDisabled(disabled)

    if (emoji) button.setEmoji(emoji)

    d.container.components[d.container.components.length - 1].addComponents([ button ])

    return fn.deflate()
}