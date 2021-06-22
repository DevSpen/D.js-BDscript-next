const { MessageActionRow } = require("discord.js");
const CompileData = require("../Structures/CompileData");
const { ClientProperties } = require("../util/Constants");

/**
 * 
 * @param {CompileData} fn 
 * @param {import("../util/Constants").ExecutionData} d 
 */
module.exports = async (fn, d) => {
    d.container.components.push(
        new MessageActionRow()
    )

    return fn.deflate()
}