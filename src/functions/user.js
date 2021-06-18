const CompileData = require("../Structures/CompileData");
const { UserProperties } = require("../util/Constants");

/**
 * 
 * @param {CompileData} fn 
 * @param {import("../util/Constants").ExecutionData} d 
 */
module.exports = async (fn, d) => {
    const [
        user,
        property 
    ] = await fn.resolveArray(d) ?? []

    if (user === undefined) return undefined

    if (!Object.keys(UserProperties).includes(property)) return fn.sendError(d.mainChannel, `property key`, property)

    const data = await UserProperties[property].code(user)

    return fn.deflate(data ?? "")
}