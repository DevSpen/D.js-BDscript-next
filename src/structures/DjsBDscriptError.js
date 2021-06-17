module.exports = class DjsBDscriptError extends Error {
    /**
     * 
     * @param {import("..").BDscriptErrors} type 
     * @param {string} data 
     */
    constructor(type, data) {
        super(`${type}: ${data}`)
    }
}