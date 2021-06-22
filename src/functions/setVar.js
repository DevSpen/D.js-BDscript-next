const CompileData = require("../Structures/CompileData");

/**
 * 
 * @param {CompileData} fn 
 * @param {import("../util/Constants").ExecutionData} d 
 */
module.exports = async (fn, d) => {
    const [
        variable,
        value, 
        id, 
        type 
    ] = await fn.resolveArray(d) ?? []

    if (variable === undefined) return undefined
    
    const val = d.bot.variables.find(c => c.name === variable)

    if (!val) return fn.sendError(d.mainChannel, "variable name", variable)

    const total = val.type === "TEXT" ? value : Number(value)
    
    const data = await d.bot.db.set("main", {
        id,
        varType: type,
        [variable]: total 
    }, {
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

    return fn.deflate()
}