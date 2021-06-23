const CompileData = require("../structures/CompileData");

/**
 * 
 * @param {CompileData} fn 
 * @param {import("../util/Constants").ExecutionData} d 
 */
module.exports = async (fn, d) => {
    const math = await fn.resolveAll(d) 

    if (math === undefined) return undefined

    const left = math.replace(/[0-9\(\)\[\]\+\-\*\.\/%]/g, "")

    if (left.length) return fn.sendError(d.mainChannel, "operation", math)

    try {
        var result = eval(math)
    } catch (error) {
        return fn.sendError(d.mainChannel, "operation", math)
    }

    return fn.deflate(result)
}