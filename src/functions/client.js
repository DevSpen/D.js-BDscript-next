const CompileData = require("../Structures/CompileData");
const { ClientProperties } = require("../util/Constants");

/**
 * 
 * @param {CompileData} fn 
 * @param {import("../util/Constants").ExecutionData} d 
 */
 module.exports = async (fn, d) => {
    const [
        property 
    ] = await fn.resolveArray(d) ?? []

    if (property === undefined) return undefined

    if (!Object.keys(ClientProperties).includes(property)) return fn.sendError(d.mainChannel, `property key`, property)

    const data = await ClientProperties[property].code(d.client)

    return fn.deflate(data ?? "")
}