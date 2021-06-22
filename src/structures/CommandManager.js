const { Collection } = require("discord.js");
const { readdirSync, lstatSync } = require("fs");
const { CommandToEvent } = require("../util/Constants");
const Bot = require("./Bot");
const CommandAdapter = require("./CommandAdapter");

module.exports = class CommandManager {
    /**
     * The command manager.
     * @param {Bot} bot the bot this command manager belongs to.
     */
    constructor(bot) {
        /**
         * @type {Bot}
         */
        this.bot = bot
        
        /**
         * @type {?string}
         */
        this.mainPath = null

        /**
         * Commands that were loaded through this manager.
         * @type {Collection<string, CommandAdapter>}
         */
        this.commands = new Collection()
    }

    /**
     * Refreshes all commands that were loaded with the manager.
     * @returns {CommandManager}
     */
    refresh() {
        for (const cmd of this.commands.array()) {
            this.bot.commands[CommandToEvent[cmd.type]].delete(cmd.snowflake)
            delete require.cache[require.resolve(cmd.data.PATH_TO_FILE)]
        }

        this.load(this.mainPath)

        return this
    }

    /**
     * @private
     * @param {string} path 
     * @param {Array<import("../util/Constants").CommandData>} array 
     */
    _resolveDirectoryFiles(path, array = []) {
        for (const file of readdirSync(path)) {
            if (lstatSync(path + "/" + file).isDirectory()) {
                this._resolveDirectoryFiles(path + "/" + file, array)
            } else {
                let PATH; 
                
                try {
                    PATH = `../../../../${path + "/" +  file}`
                    var data = require(PATH)
                } catch (error) {
                    PATH = `../../${path + "/" +  file}`
                    data = require(PATH)
                }
            
                data.PATH_TO_FILE = PATH

                array.push(data)
            }
        }

        return array
    } 

    /**
     * Loads commands from given folder.
     * @param {string} path the path to read files of.
     * @returns {CommandManager}
     */
    load(path) {
        const commands = this._resolveDirectoryFiles(path)

        for (const data of commands) {
            const command = this.bot.command(data)
            this.commands.set(command.snowflake, command)
        }

        this.mainPath = path

        return this
    }
}