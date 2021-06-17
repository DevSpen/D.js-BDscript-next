const { makeID, findFunctions } = require("../Structures/CompileData")
const CompileData = require("../Structures/CompileData")
const Definitions = require("../Util/Constants").Functions
const keys = Object.keys(Definitions).sort((x, y) => y.length - x.length)
/**
 * 
 * @param {string} code 
 */
module.exports = (code) => {
    /**
     * @type {import("../Util/Constants").CompiledObject}
     */
    const compiling = {
        functions: [],
        code: code 
    }

    while(true) {
        const after = compiling.code.split("$").slice(1).reverse()[0]

        const fnRaw = `$${after}`
        
        const key = keys.find(key => fnRaw.includes(key))

        if (!key) {
            break
        }

        const fn = Definitions[key]

        if (!fn.isProperty) {
            const id = makeID()
            const inside = after.split("[")[1].split("]")[0]
            compiling.code = compiling.code.replace(`${fn.key}[${inside}]`, id)
            compiling.functions.push(
                new CompileData()
                .setMainFunction(fn)
                .setInside(inside)
                .setFields(inside.split(";"))
                .setID(id)
            )
            continue
        } else {
            const id = makeID()
            compiling.code = compiling.code.replace(fn.key, id)
            compiling.functions.push(
                new CompileData()
                .setMainFunction(fn)
                .setID(id)
            )
            continue
        }
    }

    /**
     * @type {Array<CompileData>}
     */
    const resolved = []
    const used_ids = []

    for (const compiledFunc of compiling.functions.reverse()) {
        if (used_ids.includes(compiledFunc.id)) {
            continue
        }
        const fns = findFunctions(compiling.functions, compiledFunc)
        for (const fn of fns) {
            compiledFunc.createOverload(fn)
            used_ids.push(fn.id)
        }
        resolved.push(compiledFunc)
    }

    compiling.functions = resolved

    return compiling
}