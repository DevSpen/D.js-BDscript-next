const CompileData = require("../Structures/CompileData");

/**
 * 
 * @param {CompileData} fn 
 * @param {import("../util/Constants").ExecutionData} d 
 */
module.exports = async (fn, d) => {
    const [
        option, 
        name,
        returnID 
    ] = await fn.resolveArray(d) ?? []

    if (option === undefined) return undefined

    const data = d.bot.slash_commands.get(name)

    if (!data) return fn.sendError(d.mainChannel, "slash command data with name", name)

    if (option === "global") {
        const slash = await d.client.application.commands.create(data).catch(() => null)

        if (!slash) return fn.sendError(d.mainChannel, `:x: Failed to create slash command '${name}' in \`${fn.image}\``)

        return fn.deflate(returnID ? slash.id : "")
    } else {
        const guild = d.client.guilds.cache.get(option)

        if (!guild) return fn.sendError(d.mainChannel, "guild ID", option)

        const slash = await guild.commands.create(data).catch(() => null)

        if (!slash) return fn.sendError(d.mainChannel, `:x: Failed to create guild slash command '${name}' in \`${fn.image}\``)
    
        return fn.deflate(returnID ? slash.id : "")
    }
}