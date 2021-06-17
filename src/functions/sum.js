const CompileData = require("../Structures/CompileData");

/**
 * 
 * @param {CompileData} fn 
 * @param {import("../util/Constants").ExecutionData} d 
 */
module.exports = async (fn, d) => {
    const array = await fn.resolveArray(d)

    if (array === undefined) return undefined

    return fn.deflate(array.reduce((x, y) => x + y, 0))
} 