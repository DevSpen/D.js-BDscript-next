const CompileData = require("../structures/CompileData");

/**
 * 
 * @param {CompileData} fn 
 * @param {import("../util/Constants").ExecutionData} d 
 */
module.exports = async (fn, d) => {
    if (d.bot.manager.mainPath === null) return fn.sendError(d.mainChannel, ":x: The command manager was not used.")

    d.bot.manager.refresh()

    return fn.deflate()
}