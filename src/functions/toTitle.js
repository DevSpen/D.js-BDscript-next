const CompileData = require("../structures/CompileData");

/**
 * 
 * @param {CompileData} fn 
 * @param {import("../util/Constants").ExecutionData} d 
 */
module.exports = async (fn, d) => {
    const [text, separator] = await fn.resolveArray(d) ?? []

    if (text === undefined) return undefined

    return fn.deflate(text.split(separator).map(w => w[0].toUpperCase() + w.slice(1).toLowerCase()).join(" "))
}