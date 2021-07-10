const CompileData = require("../structures/CompileData");

/**
 * 
 * @param {CompileData} fn 
 * @param {import("../util/Constants").ExecutionData} d 
 */
module.exports = async (fn, d) => {
    const [
        text, 
        ...words 
    ] = await fn.resolveArray(d) ?? []

    if (text === undefined) return undefined

    return fn.deflate(words.some(w => text.includes(w)))
}