const CompileData = require("../Structures/CompileData");

/**
 * 
 * @param {CompileData} fn 
 * @param {import("../util/Constants").ExecutionData} d 
 */
module.exports = async (fn, d) => {
    if (fn.inside) {
        const [index] = await fn.resolveArray(d) ?? []

        if (index === undefined) return undefined

        return fn.deflate(d.args[index - 1] ?? "")
    } else {
        return fn.deflate(d.args.join(" "))
    }
}