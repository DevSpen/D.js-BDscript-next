const CompileData = require("../structures/CompileData");

/**
 * 
 * @param {CompileData} fn 
 * @param {import("../util/Constants").ExecutionData} d 
 */
module.exports = async (fn, d) => {
    const opt = await fn.resolveAll(d)

    if (opt === undefined) return undefined

    return fn.deflate(d.extras?.options?.get(opt)?.value ?? "")
}