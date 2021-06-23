const CompileData = require("../structures/CompileData");

/**
 * 
 * @param {CompileData} fn 
 * @param {import("../util/Constants").ExecutionData} d 
 */
module.exports = async (fn, d) => {
    const msg = await fn.resolveAll(d)

    if (msg === undefined) return undefined

    console.log(msg)

    return fn.deflate()
}