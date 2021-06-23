const CompileData = require("../structures/CompileData");

/**
 * 
 * @param {CompileData} fn 
 * @param {import("../util/Constants").ExecutionData} d 
 */
module.exports = async (fn, d) => {
    const [
        key, 
        val
    ] = await fn.resolveArray(d) ?? []

    if (key === undefined) return undefined

    d.container.keywords[key] = val

    return fn.deflate()
}