const { MessageAttachment } = require("discord.js");
const CompileData = require("../structures/CompileData");

/**
 * 
 * @param {CompileData} fn 
 * @param {import("../util/Constants").ExecutionData} d 
 */
module.exports = async (fn, d) => {
    const [
        name,
        url
    ] = await fn.resolveArray(d) ?? []

    if (name === undefined) return undefined

    d.container.files.push(new MessageAttachment(url, name))
     
    return fn.deflate()
}