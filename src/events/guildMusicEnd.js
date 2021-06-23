const musicEndCommands = require("../handlers/musicEndCommands");
const Track = require("../structures/Track");

/**
 * 
 * @param {import("../util/Constants").VoiceData} audio 
 * @param {Track} track 
 */
module.exports = (audio, track) => {
    musicEndCommands(audio, track)
}