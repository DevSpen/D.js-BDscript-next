const CompileData = require("../structures/CompileData");

/**
 * 
 * @param {CompileData} fn 
 * @param {import("../util/Constants").ExecutionData} d 
 */
module.exports = (fn, d) => {
    return fn.deflate(d.message?.author?.id ?? "")
}