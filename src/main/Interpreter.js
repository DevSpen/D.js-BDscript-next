const { Client, Message } = require("discord.js")
const Container = require("../structures/Container")

/**
 * 
 * @param {Client} client 
 * @param {import("../util/Constants").ExecutionData} data 
 * @returns {Promise<?Container|Message>}
 */
module.exports = async (client, data) => {
    data.client = client

    data.channel = data.message?.channel ?? data.channel ?? data.mainChannel 

    data.mainChannel = data.message?.channel ?? data.channel

    data.container = new Container(data.command)
    
    data.startedTimestamp = Date.now()

    data.container.setChannel(data.channel)

    for (const fn of data.command.compiled.functions) {
        try {
            const d = await fn.execute(data)
            if (!d) return undefined
            else {
                if (d.with === undefined) continue
                data.container.content = data.container.content.replace(d.id, d.with)    
            }
        } catch (error) {
            return data.container.execute(error.stack, data.mainChannel)
        }
    }

    if (data.returnContainer) {
        return data.container
    }

    const m = await data.container.execute(data.container.content)

    return m 
}