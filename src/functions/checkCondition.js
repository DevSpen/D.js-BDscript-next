const CompileData = require("../structures/CompileData");
const { condition, OPERATORS } = require("../util/Constants");

/**
 * 
 * @param {CompileData} fn 
 * @param {import("../util/Constants").ExecutionData} d 
 */
module.exports = async (fn, d) => {
    const [
        cond
    ] = fn.fields

    const op = OPERATORS.find(e => cond.includes(e))

    if (!op) return fn.sendError(d.mainChannel, "operator", "''")

    const value1 = await fn.resolveCode(d, cond.split(op)[0])

    if (value1 === undefined) return undefined

    const value2 = await fn.resolveCode(d, cond.split(op)[1])

    if (value2 === undefined) return undefined

    return fn.deflate(condition(value1, op, value2))
}