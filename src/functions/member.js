const CompileData = require("../structures/CompileData");
const { MemberProperties } = require("../util/Constants");

/**
 * 
 * @param {CompileData} fn 
 * @param {import("../util/Constants").ExecutionData} d 
 */
module.exports = async (fn, d) => {
    const [
        guild, 
        member,
        property 
    ] = await fn.resolveArray(d) ?? []

    if (guild === undefined) return undefined

    if (!Object.keys(MemberProperties).includes(property)) return fn.sendError(d.mainChannel, `property key`, property)

    const data = await MemberProperties[property].code(member)

    return fn.deflate(data ?? "")
}