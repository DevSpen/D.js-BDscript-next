const CompileData = require("../Structures/CompileData");
const { RoleProperties } = require("../util/Constants");

/**
 * 
 * @param {CompileData} fn 
 * @param {import("../util/Constants").ExecutionData} d 
 */
module.exports = async (fn, d) => {
    const [
        guild, 
        role,
        property 
    ] = await fn.resolveArray(d) ?? []

    if (guild === undefined) return undefined

    if (!Object.keys(RoleProperties).includes(property)) return fn.sendError(d.mainChannel, `property key`, property)

    const data = await RoleProperties[property].code(role)

    return fn.deflate(data ?? "")
}