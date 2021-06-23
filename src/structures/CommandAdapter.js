const Compiler = require("../main/Compiler")

/**
 * hi
 */
module.exports = class CommandAdapter {
    /**
     * 
     * @param {import("../Util/Constants").CommandData} data 
     * @param {?string} code
     */
    constructor(data = {}, code) {
        /**
         * @type {import("../Util/Constants").CompiledObject}
         */
        this.compiled = Compiler(code ?? data.code)

        /**
         * @type {string}
         */
        this.type = data.type

        /**
         * @type {string}
         */
        this.snowflake = (Math.floor(Math.random() * 999999999999)).toString()

        /**
         * @type {?string}
         */
        this.code = code ?? data.code

        /**
         * @type {import("../Util/Constants").CommandData}
         */
        this.data = data
    }
}