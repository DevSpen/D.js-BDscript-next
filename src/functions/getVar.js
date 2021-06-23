const CompileData = require("../structures/CompileData");

/**
 * 
 * @param {CompileData} fn 
 * @param {import("../util/Constants").ExecutionData} d 
 */
module.exports = async (fn, d) => {
    const [
        variable,
        id, 
        type 
    ] = await fn.resolveArray(d) ?? []

    if (variable === undefined) return undefined
    
    const val = d.bot.variables.find(c => c.name === variable)

    if (!val) return fn.sendError(d.mainChannel, "variable name", variable)

    const data = await d.bot.db.get("main", {
        where: [
            {
                column: "id",
                equals: id 
            },
            {
                column: "varType",
                equals: type
            }
        ]
    }) 

    if (!data) {
        return fn.deflate(val.default ?? "")
    }

    return fn.deflate(data[variable] ?? val.default ?? "")
}