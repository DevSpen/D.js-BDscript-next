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
        url
    ] = await fn.resolveArray(d) ?? []

    if (index === undefined) return undefined

    d.container.getEmbed(index).setTitle(text) 

    if (url) d.container.getEmbed(index).setURL(url)

    return fn.deflate()
}