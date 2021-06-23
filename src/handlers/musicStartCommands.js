const Interpreter = require("../main/Interpreter");
const Bot = require("../structures/Bot");
const Track = require("../structures/Track");

/**
 * @param {Client} client
 * @param {import("../util/Constants").VoiceData} audio 
 * @param {Track} track 
 */
module.exports = (client, audio, track) => {
    /**
     * @type {Bot}
     */
    const bot = client.bot 

    const commands = bot.commands.onMusicStart 

    if (!commands.size) return undefined

    for (const command of commands.array()) {
        Interpreter(bot.client, {
            message: {
                channel: audio.channel,
                author: bot.client.user,
                guild: audio.guild,
                member: audio.guild.me
            },
            args: [],
            command, 
            mainChannel: audio.channel,
            channel: audio.channel,
            extras: {
                track 
            }
        })
    }
}