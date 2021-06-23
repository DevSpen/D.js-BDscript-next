const CompileData = require("../structures/CompileData");

/**
 * 
 * @param {CompileData} fn 
 * @param {import("../util/Constants").ExecutionData} d 
 */
module.exports = async (fn, d) => {
    const [time] = await fn.resolveArray(d) ?? []

    if (time === undefined) return undefined

    await new Promise(e => setTimeout(e, time))

    return fn.deflate()
}