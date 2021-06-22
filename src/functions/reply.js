const CompileData = require("../Structures/CompileData");
const utils = require("ms-utility")

/**
 * 
 * @param {CompileData} fn 
 * @param {import("../util/Constants").ExecutionData} d 
 */
module.exports = async (fn, d) => {
    if (fn.inside) {
        const [mention] = await fn.resolveArray(d)

        if (mention === undefined) return undefined

        d.container.replyOptions.isReply = true

        d.container.setChannel(d.message)

        d.container.replyOptions.replyType = "reply"

        d.container.replyOptions.replyMention = mention
        
        return fn.deflate()
    } else {
        d.container.replyOptions.isReply = true

        d.container.setChannel(d.message)
        
        d.container.replyOptions.replyType = "reply"

        return fn.deflate()
    }
}