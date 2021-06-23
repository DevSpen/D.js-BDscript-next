const Container = require("../structures/Container")
const Interpreter = require("../main/Interpreter");
const CommandAdapter = require("../structures/CommandAdapter");
const CompileData = require("../structures/CompileData");

/**
 * 
 * @param {CompileData} fn 
 * @param {import("../util/Constants").ExecutionData} d 
 */
module.exports = async (fn, d) => {
    if (fn.inside) {
        const code = await fn.resolveAll(d)

        if (code === undefined) return undefined

        const c = new CommandAdapter({
            name: "eval",
            code
        })

        const clone = fn._clone({
            command: c,
            container: new Container(c)
        }, d)

        await Interpreter(d.client, clone)
    
        return fn.deflate()
    } else {
        const c = new CommandAdapter({
            name: "eval",
            code: d.args.join(" ")
        })

        const clone = fn._clone({
            command: c,
            container: new Container(c)
        }, d)

        await Interpreter(d.client, clone)

        return fn.deflate()
    }
}