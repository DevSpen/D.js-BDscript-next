const CompileData = require("../structures/CompileData");

/**
 * 
 * @param {CompileData} fn 
 * @param {import("../util/Constants").ExecutionData} d 
 */
module.exports = async (fn, d) => {
    const [
        index, 
        text,
        icon
    ] = await fn.resolveArray(d) ?? []

    if (index === undefined) return undefined

    d.container.getEmbed(index).setFooter(text, icon)
     
    return fn.deflate()
}