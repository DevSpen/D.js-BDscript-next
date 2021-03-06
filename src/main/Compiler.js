const { makeID, findFunctions } = require("../structures/CompileData")
const CompileData = require("../structures/CompileData")
const Definitions = require("../util/Constants")
const DjsBDscriptError = require("../structures/DjsBDscriptError")
var keys = null

/**
 * 
 * @param {string} code 
 */
module.exports = (code) => {
    keys = keys ?? Object.keys(Definitions.Functions).sort((x, y) => y.length - x.length)
    
    /**
     * @type {import("../Util/Constants").CompiledObject}
     */
    const compiling = {
        functions: [],
        code: code 
    }

    for (const after of compiling.code.split("$").slice(1).reverse()) {
        const key = `$${after}`.match(new RegExp(`(${keys.map(e => "\\" + e).join("|")})`, "g"))?.[0]

        if (!key) {
            continue
        } 

        const fn = Definitions.Functions[key]

        if (!fn.isProperty) {
            const r = code.split(fn.key).length - 1 
            const after = code.split(fn.key)[r]
            if (!fn.optional && (!after.includes("[") || !after.includes("]"))) {
                throw new DjsBDscriptError("SYNTAX_ERROR", `${fn.key} has no brackets.`)
            }
            const id = makeID()
            const inside = after.split("[")[1]?.split("]")?.[0] ?? undefined

            const result = inside === undefined ? fn.key : `${fn.key}[${inside}]`
            compiling.code = compiling.code.replaceLast(result, id)
            code = code.replaceLast(result, id)

            const comp = new CompileData()
            .setMainFunction(fn)
            .setID(id)
            if (inside !== undefined) {
                comp.setInside(inside)
                .setFields(inside.split(";"))
            }
            compiling.functions.push(
                comp
            )
            continue
        } else {
            const id = makeID()
            compiling.code = compiling.code.replaceLast(fn.key, id)
            code = code.replaceLast(fn.key, id)
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
            function merge(compiledFunc, compiling) {
                const fns = findFunctions(compiling.functions, compiledFunc)
                for (const fn of fns) {
                    compiledFunc.createOverload(fn)
                    used_ids.push(fn.id)
                }
            }
            merge(compiledFunc, compiling)
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

String.prototype.replaceLast = function (what, replacement) {
    let pcs = this.split(what);
    let lastPc = pcs.pop();
    return pcs.join(what) + replacement + lastPc;
};