const CompileData = require("../structures/CompileData");

/**
 * 
 * @param {CompileData} fn 
 * @param {import("../util/Constants").ExecutionData} d 
 */
module.exports = async (fn, d) => {
    const [
        key
    ] = await fn.resolveArray(d) ?? []

    if (key === undefined) return undefined

    return fn.deflate(d.container.keywords[key])
}