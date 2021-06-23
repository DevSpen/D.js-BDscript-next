const musicStartCommands = require("../handlers/musicStartCommands");
const Track = require("../structures/Track");

/**
 * 
 * @param {import("../util/Constants").VoiceData} audio 
 * @param {Track} track 
 */
module.exports = (audio, track) => {
    musicStartCommands(audio, track)
}