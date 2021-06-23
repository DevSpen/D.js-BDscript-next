const CompileData = require("../structures/CompileData");

/**
 * 
 * @param {CompileData} fn 
 * @param {import("../util/Constants").ExecutionData} d 
 */
module.exports = async (fn, d) => {
    const [
        index, 
        url 
    ] = await fn.resolveArray(d) ?? []

    if (index === undefined) return undefined

    d.container.getEmbed(index).setThumbnail(url)

    return fn.deflate()
}