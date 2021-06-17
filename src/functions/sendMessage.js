const CompileData = require("../Structures/CompileData");

/**
 * 
 * @param {CompileData} fn 
 * @param {import("../util/Constants").ExecutionData} d 
 */
module.exports = async (fn, d) => {
    const [
        channelID,
        message 
    ] = (await fn.resolveArray(d)) ?? []

    if (channelID === undefined) return undefined

    const channel = d.client.channels.cache.get(channelID)

    if (!channel) return fn.sendError(d.mainChannel, "channel ID", channelID)
    
    await d.container.execute(message)

    return fn.deflate()
}