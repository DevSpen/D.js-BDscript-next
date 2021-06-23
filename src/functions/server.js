const CompileData = require("../structures/CompileData");
const { ServerProperties } = require("../util/Constants");

/**
 * 
 * @param {CompileData} fn 
 * @param {import("../util/Constants").ExecutionData} d 
 */
module.exports = async (fn, d) => {
    const [
        guild,
        property 
    ] = await fn.resolveArray(d) ?? []

    if (guild === undefined) return undefined

    if (!Object.keys(ServerProperties).includes(property)) return fn.sendError(d.mainChannel, `property key`, property)

    const data = await ServerProperties[property].code(guild)

    return fn.deflate(data ?? "")
}