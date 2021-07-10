const { createAudioResource, AudioResource, demuxProbe, StreamType } = require("@discordjs/voice")
const { Client } = require("discord.js")

module.exports = class Track {
    /**
     * @param {import("../util/Constants").TrackData} track 
     */
    constructor(track = {}) {
        this.data = track

    }

	onFinish(guildID) {
		this.client.emit("guildMusicEnd", this.client.bot.audio.guilds.get(guildID), this.data)
	}

	onStart(guildID) {
		this.client.emit("guildMusicStart", this.client.bot.audio.guilds.get(guildID), this.data)
	}

	/**
	 * @type {Client}
	 */
	get client() {
		return this.data.user?.client 
	}

    /**
     * Creates an audio resource of this track.
     * @param {?Object} options the options to use against this track. 
     * @returns {Promise<AudioResource<Track>>} 
     */
    createAudioResource(options = {}) {
		const { raw } = require("youtube-dl-exec")
		
		return new Promise((resolve, reject) => {
			const process = raw(
				this.data.url,
				{
					o: '-',
					q: '',
					f: 'bestaudio[ext=webm+acodec=opus+asr=48000]/bestaudio',
					r: '100K',
				},
				{ stdio: ['ignore', 'pipe', 'ignore'] },
			);
			if (!process.stdout) {
				reject(new Error('No stdout'));
				return;
			}
			const stream = process.stdout;
			const onError = (error) => {
				if (!process.killed) process.kill();
				stream.resume();
				reject(error);
			};
			process
				.once('spawn', () => {
					demuxProbe(stream)
						.then((probe) => resolve(createAudioResource(probe.stream, {
							inputType: probe.type,
							metadata: this
						})))
						.catch(onError);
				})
				.catch(onError);
		});
    }
}