const CompileData = require("../Structures/CompileData");

/**
 * 
 * @param {CompileData} fn 
 * @param {import("../util/Constants").ExecutionData} d 
 */
module.exports = async (fn, d) => {
    const [
        channel,
        message,
        returnID
    ] = (await fn.resolveArray(d)) ?? []

    if (channel === undefined) return undefined

    const m = await d.container.execute(message, channel)

    return fn.deflate(returnID && m ? m.id : "")
}