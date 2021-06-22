const Compiler = require("../main/Compiler")

/**
 * hi
 */
module.exports = class CommandAdapter {
    /**
     * 
     * @param {import("../Util/Constants").CommandData} data 
     */
    constructor(data = {}) {
        /**
         * @type {import("../Util/Constants").CompiledObject}
         */
        this.compiled = Compiler(data.code)

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
        this.code = data.code

        /**
         * @type {import("../Util/Constants").CommandData}
         */
        this.data = data
    }
}