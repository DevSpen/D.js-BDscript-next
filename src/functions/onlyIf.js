const CompileData = require("../structures/CompileData");
const { MemberProperties, OPERATORS, condition } = require("../util/Constants");

/**
 * 
 * @param {CompileData} fn 
 * @param {import("../util/Constants").ExecutionData} d 
 */
module.exports = async (fn, d) => {
    const [
        cond, 
        code 
    ] = fn.fields

    const op = OPERATORS.find(e => cond.includes(e))

    if (!op) return fn.sendError(d.mainChannel, "operator", "''")

    const value1 = await fn.resolveCode(d, cond.split(op)[0])

    if (value1 === undefined) return undefined

    const value2 = await fn.resolveCode(d, cond.split(op)[1])

    if (value2 === undefined) return undefined

    const pass = condition(value1, op, value2)

    if (!pass) {
        if (code) {
            const txt = await fn.resolveCode(d, code) 

            if (txt === undefined) return undefined

            d.container.execute(txt)

            return undefined
        }
    }

    return fn.deflate()
}