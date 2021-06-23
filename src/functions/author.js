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
        url,
        hover
    ] = await fn.resolveArray(d) ?? []

    if (index === undefined) return undefined

    d.container.getEmbed(index).setAuthor(text, url, hover)
     
    return fn.deflate()
}