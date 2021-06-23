const CompileData = require("../structures/CompileData");

/**
 * 
 * @param {CompileData} fn 
 * @param {import("../util/Constants").ExecutionData} d 
 */
module.exports = async (fn, d) => {
    const [channel] = await fn.resolveArray(d) ?? []

    if (channel === undefined) return undefined

    const connection = d.bot.audio.joinVoice(channel.id)

    if (!connection) return fn.sendError(d.mainChannel, `:x: Failed to join voice channel!`)

    return fn.deflate()
}