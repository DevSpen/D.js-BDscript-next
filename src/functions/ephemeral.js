const CompileData = require("../Structures/CompileData");

/**
 * 
 * @param {CompileData} fn 
 * @param {import("../util/Constants").ExecutionData} d 
 */
module.exports = (fn, d) => {
    d.container.replyOptions.isReplyEphemeral = true
    
    return fn.deflate()
}