const CompileData = require("../structures/CompileData");

/**
 * 
 * @param {CompileData} fn 
 * @param {import("../util/Constants").ExecutionData} d 
 */
module.exports = async (fn, d) => {
    const [n] = await fn.resolveArray(d) ?? []

    if (n === undefined) return undefined

    return fn.deflate(n.toLocaleString())
}