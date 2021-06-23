const CompileData = require("../structures/CompileData");

/**
 * 
 * @param {CompileData} fn 
 * @param {import("../util/Constants").ExecutionData} d 
 */
module.exports = async (fn, d) => {
    const path = await fn.resolveAll(d)

    if (path === undefined) return undefined

    try {
        var data = await eval(`d.container.data.${path}`)
    } catch (error) {
        return fn.sendError(d.mainChannel, "property data", path)
    }

    if (data === undefined) return fn.sendError(d.mainChannel, "property data", path)

    return fn.deflate(data)
}