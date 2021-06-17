const CompileData = require("../Structures/CompileData");

/**
 * 
 * @param {CompileData} fn 
 * @param {import("../util/Constants").ExecutionData} d 
 */
module.exports = async (fn, d) => {
    const [
        channel,
        message 
    ] = (await fn.resolveArray(d)) ?? []

    if (channel === undefined) return undefined

    await d.container.execute(message, channel)

    return fn.deflate()
}