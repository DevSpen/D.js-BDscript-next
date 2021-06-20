const CompileData = require("../Structures/CompileData");

/**
 * 
 * @param {CompileData} fn 
 * @param {import("../util/Constants").ExecutionData} d 
 */
module.exports = async (fn, d) => {
    const [
        elements,
        splitter,
        code,
        separator 
    ] = await fn.resolveAndExcludeArray(d, [2]) ?? []

    const values = elements.split(splitter)

    const content = []

    for (const value of values) {
        d.container.addData(value, "value")
        const txt = await fn.resolveCode(d, code)
        if (txt === undefined) return undefined
        if (txt) {
            content.push(txt)
        } 
    }

    return fn.deflate(content.join(separator))
}