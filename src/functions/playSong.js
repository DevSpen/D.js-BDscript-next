const CompileData = require("../structures/CompileData");

/**
 * 
 * @param {CompileData} fn 
 * @param {import("../util/Constants").ExecutionData} d 
 */
module.exports = async (fn, d) => {
    const [
        guild, 
        option,
        isPlayingNow
    ] = await fn.resolveArray(d) ?? []

    if (guild === undefined) return undefined

    const audio = d.bot.audio.guilds.get(guild.id)

    if (!audio) return fn.sendError(`:x: No voice connection found!`)

    let info; 

    const search = require("yt-search")

    if (/https?:/g.test(option)) {
        const id = option.split("/").reverse()[0]

        const video = await search({ videoId: id })
    
        info = {
            user: d.message.author, 
            title: video.title,
            thumbnail: video.thumbnail, 
            duration: video.duration.seconds,
            uri: video.videoId,
            url: video.url,
            author: video.author.name,
            image: video.image 
        }
    } else {
        try {
            var videos = await search(option).then(data => data.videos)
        } catch (error) {
            return fn.sendError(`:x: ${error.message} from \`${fn.image}\``)
        }

        const video = videos[0]

        info = {
            user: d.message.author, 
            title: video.title,
            thumbnail: video.thumbnail, 
            duration: video.duration.seconds,
            uri: video.videoId,
            url: video.url,
            author: video.author.name,
            image: video.image 
        }
    }

    if (!info) return fn.sendError(d.mainChannel, `:x: Not videos found.`)

    d.bot.audio.add(guild.id, { channel: d.message.channel })

    const playing = await d.bot.audio.queue(guild.id, info)

    if (playing === undefined) fn.sendError(d.mainChannel, `:x: Stream timed out.`)

    return fn.deflate(isPlayingNow ? playing : "")
}