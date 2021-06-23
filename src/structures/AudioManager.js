const { VoiceConnection, joinVoiceChannel, getVoiceConnection, createAudioPlayer, AudioPlayerStatus, entersState, VoiceConnectionStatus } = require("@discordjs/voice");
const { Collection, VoiceChannel } = require("discord.js");
const Bot = require("./Bot");
const Track = require("./Track");

module.exports = class AudioManager {
    /**
     * Creates an audio manager.
     * @param {Bot} bot the bot this manager belongs to.
     */
    constructor(bot) {
        /**
         * @type {Bot}
         */
        this.bot = bot

        /**
         * @type {Collection<string, import("../util/Constants").VoiceData}
         */
        this.guilds = new Collection()
    }

    /**
     * Makes the bot join a voice channel.
     * @param {string} channelID the voice channel to join to. 
     * @returns {?VoiceConnection}
     */
    joinVoice(channelID) {
        /**
         * @type {VoiceChannel}
         */
        const channel = this.bot.client.channels.cache.get(channelID)
        
        if (!channel || channel.type !== "voice") return undefined

        if (this.guilds.has(channel.guild.id)) {
            const audio = this.guilds.get(channel.guild.id)

            if (audio.connection) return audio.connection
        }

        const connection = joinVoiceChannel({
            guildId: channel.guild.id,
            channelId: channel.id,
            adapterCreator: channel.guild.voiceAdapterCreator
        })

        if (!connection) return undefined

        this.guilds.set(channel.guild.id, {
            all: [],
            queue: [],
            voice: channel,
            loopType: 0, 
            player: createAudioPlayer(),
            volume: 100,
            connection, 
            channel: null,
            guild: channel.guild,
            lastMessage: null
        })

        return connection
    }

    /**
     * Leaves a voice channel and destroys its voice data.
     * @param {string} channelID the channel to leave.
     * @returns {boolean}
     */
    leaveVoice(channelID) {
        /**
         * @type {VoiceChannel}
         */
        const channel = this.bot.client.channels.cache.get(channelID)

        if (!channel || channel.type !== "voice") return false

        const connection = getVoiceConnection(channel.guild.id)

        if (!connection) return false

        connection.destroy()

        this.guilds.delete(channel.guild.id)

        return true
    }

    /**
     * Plays a song in a voice channel.
     * @param {string} guildID the guild to play in.
     * @param {Object} options options to pass to ytdl
     * @returns {Promise<boolean|undefined|number>}
     */
    async play(guildID, options) {
        const audio = this.guilds.get(guildID)
        
        if (!audio) return undefined

        const track = audio.queue[0]

        const resource = await track.createAudioResource(options)

        if (!resource) return undefined

        const done = this.subscribe(guildID)

        if (!done) return undefined

        audio.player.play(resource)

        const success = await entersState(audio.connection, VoiceConnectionStatus.Ready, 5000).catch(() => null)

        if (!success) return undefined

        return true
    }

    /**
     * Subscribes a player.
     * @param {string} guildID the guild to subscribe the player to.
     */
    subscribe(guildID) {
        const audio = this.guilds.get(guildID)

        if (!audio) return undefined

        if (audio.subscription) return true

        const subscription = audio.connection.subscribe(audio.player)

        if (!subscription) return undefined

        audio.subscription = subscription

        audio.player.on("stateChange", (oldState, newState) => {
            if (oldState.status === AudioPlayerStatus.Playing && newState.status === AudioPlayerStatus.Idle) {
                scope: {
                    const audio = this.guilds.get(guildID)

                    if (audio.loopType === 0) {
                        audio.queue.shift()
                    }
    
                    if (!audio.queue.length) {
                        if (audio.loopType === 0) {
                            audio.player.track.onFinish(guildID)
                            return this.leaveVoice(audio.voice.id)
                        }
                    }

                    audio.player.track.onFinish(guildID)
        
                    delete audio.player.track
                
                    this.guilds.set(guildID, audio)
    
                    this.play(guildID)
                }
            } else if (newState.status === AudioPlayerStatus.Playing) {
                audio.player.state.resource.metadata.onStart(guildID)
                audio.player.track = audio.player.state.resource.metadata
                this.guilds.set(guildID, audio)
            }
        })

        this.guilds.set(guildID, audio)

        return true
    }

    /**
     * Adds data to a voice data.
     * @param {string} guildID 
     * @param {Object} source 
     * @returns {boolean|undefined}
     */
    add(guildID, source) {
        const audio = this.guilds.get(guildID)

        if (!guildID) return undefined

        this.guilds.set(guildID, Object.assign(audio, source))

        return true
    }

    /**
     * Queues given tracks.
     * @param {string} guildID the guild to add these tracks to.
     * @param {import("../util/Constants").TrackData[]|import("../util/Constants").TrackData} tracks track or tracks to queue. 
     * @returns {Promise<boolean|undefined|number>}
     */
    async queue(guildID, tracks) {
        const audio = this.guilds.get(guildID)

        if (!audio) return undefined

        if (!Array.isArray(tracks)) {
            return this.queue(guildID, [tracks])
        }

        const lastStatus = audio.queue.length

        for (const data of tracks) {
            const track = new Track(data)

            audio.queue.push(track)
            audio.all.push(track)
        }

        if (lastStatus === 0) {
            const enters = await this.play(guildID)
            if (enters !== true) return enters
            return true
        } else {
            return false
        }
    }
}