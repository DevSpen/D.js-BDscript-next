const CompileData = require("../structures/CompileData");
const utils = require("ms-utility")

/**
 * 
 * @param {CompileData} fn 
 * @param {import("../util/Constants").ExecutionData} d 
 */
module.exports = async (fn, d) => {
    const [ms] = await fn.resolveArray(d) ?? []

    if (ms === undefined) return undefined

    const str = utils.parseMS(ms).toString({
        separator: ", "
    })

    return fn.deflate(str)
}