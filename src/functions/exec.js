const CompileData = require("../structures/CompileData");

/**
 * 
 * @param {CompileData} fn 
 * @param {import("../util/Constants").ExecutionData} d 
 */
module.exports = async(fn, d) => {
    const command = await fn.resolveAll(d)

    if (command === undefined) return undefined

    try {
        var got = await require("child_process").execSync(command)
    } catch (error) {
        got = error.message 
    }

    return fn.deflate(typeof got === "string" ? got : got.toString("utf-8"))
}