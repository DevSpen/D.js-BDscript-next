const CompileData = require("../structures/CompileData");
const { CommandToEvent } = require("../util/Constants");

/**
 * 
 * @param {CompileData} fn 
 * @param {import("../util/Constants").ExecutionData} d 
 */
module.exports = async (fn, d) => {
    const [
        type,
        name,
        property 
    ] = await fn.resolveArray(d) ?? []

    if (type === undefined) return undefined

    const event = CommandToEvent[type]

    if (!event) return fn.sendError(d.mainChannel, "command type", type)

    const commands = d.bot.commands[event]

    const command = commands.find(c => c.data.name === name)

    if (!command) return fn.sendError(d.mainChannel, "command name", name)

    const prop = command.data[property]

    return fn.deflate(prop === undefined ? "" : typeof prop === "object" ? require("util").inspect(prop) : prop)
}