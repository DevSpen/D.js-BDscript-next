const CompileData = require("../structures/CompileData");

/**
 * 
 * @param {CompileData} fn 
 * @param {import("../util/Constants").ExecutionData} d 
 */
module.exports = async (fn, d) => {
    const [
        index, 
        title,
        value
    ] = await fn.resolveArray(d) ?? []

    if (index === undefined) return undefined

    d.container.getEmbed(index).addField(title, value)

    return fn.deflate()
}