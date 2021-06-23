const CompileData = require("../structures/CompileData");

/**
 * 
 * @param {CompileData} fn 
 * @param {import("../util/Constants").ExecutionData} d 
 */
module.exports = async (fn, d) => {
    const [channel] = await fn.resolveArray(d) ?? []

    if (channel === undefined) return undefined

    const left = d.bot.audio.leaveVoice(channel.id)

    if (!left) return fn.sendError(d.mainChannel, `:x: Failed to leave voice channel!`)

    return fn.deflate()
}