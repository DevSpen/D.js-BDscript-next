const CompileData = require("../Structures/CompileData");

/**
 * 
 * @param {CompileData} fn 
 * @param {import("../util/Constants").ExecutionData} d 
 */
module.exports = async (fn, d) => {
    const [
        ephemeral 
    ] = await fn.resolveArray(d) ?? []

    if (ephemeral === undefined) return undefined

    await d.message.defer().catch(() => null)

    d.container.replyOptions.isReplyWaiting = true

    return fn.deflate()
}