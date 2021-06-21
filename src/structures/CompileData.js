const ms = require("ms-utility")
const Constants = require("../util/Constants")

module.exports = class CompileData {
    constructor() {
        /**
         * @type {Array<CompileData>}
         */
        this.overloads = []

        /**
         * @type {import("../util/Constants").Prototype}
         */
        this.mainFunction = null

        /**
         * @type {?string}
         */
        this.inside = null

        /**
         * @type {?Array<string>} 
         */
        this.fields = null

        /**
         * @type {?string}
         */
        this.id = null 

        /**
         * @type {?string}
         */
        this.parent
    }

    /**
     * 
     * @param {string} id 
     * @returns {CompileData}
     */
    setID(id) {
        this.id = id 
        return this 
    }

    /**
     * 
     * @param {import("../util/Constants").Prototype} fn 
     */
    setMainFunction(fn) {
        this.mainFunction = fn 
        return this
    }

    setParent(id) {
        this.parent = id 
        return this 
    }

    /**
     * 
     * @param {CompileData} data 
     * @returns {CompileData}
     */
    createOverload(data) {
        data.setParent(this.id)
        this.overloads.push(data)
        return this
    }

    /**
     * 
     * @param {string} text 
     * @param {number|string} id 
     */
    replace(text, id) {
        this.code = this.code.replace(text, id)
        return this 
    }

    setInside(code) {
        this.inside = code
        return this
    }

    setFields(fields) {
        this.fields = Array.isArray(fields) ? fields : fields.split(";")
        return this
    }

    /**
     * @type {string}
     */
    get image() {
        if (this.mainFunction.isProperty) {
            return this.total
        } else {
            if (this.inside === undefined) {
                return this.total
            }
            let image = `${this.mainFunction.key}[${this.inside}]`
            for (const overload of this.overloads) {
                image = image.replace(overload.id, overload.image)
            }
            return image
        }
    }

    sendError(channel, ...data) {
        if (!channel) return undefined

        const created = data.length === 1 ? data[0] : `:x: Invalid ${data[0]} \`${data[1]}\` in \`${this.image}\`!`

        try {
            channel.send(created).catch(() => null)
        } catch (error) {
            console.log(created, error.message)
        }
        return undefined
    }

    /**
     * @type {string}
     */
    get total() {
        if (!this.mainFunction.isProperty) {
            if (!this.inside) {
                return this.mainFunction.key
            }
            return `${this.mainFunction.key}[${this.inside}]`
        }
        return `${this.mainFunction.key}`
    }

    static makeID() {
        return `FUNCTION_DATA=${Math.floor(Math.random() * 99999999999)}`
    }

    /**
     * 
     * @param {Array<CompileData>} fns 
     * @param {CompileData} fn 
     */
    static findFunctions(fns, fn) {
        const left = fns.filter(e => fn.inside?.includes(e.id))
        return left
    }

    /**
     * @type {boolean}
     */
    get isProperty() {
        return this.mainFunction.isProperty
    }

    /**
     * 
     * @param {string} code  
     * @returns {CompileData[]}
     */
    overloadsFor(code) {
        return this.overloads.filter(over => code.includes(over.id))
    }

    /**
     * @param {Object} data 
     * @returns {Promise<string|undefined>}
     */
    async resolveAll(data) {
        const array = await this.resolveArray(data)
        if (!array) return undefined
        return array.join(";")
    }

    /**
     * 
     * @param {Object} data 
     * @param {number[]|string[]} indexes 
     * @returns {Promise<string[]>}
     */
    async resolveAndExcludeArray(data, indexes) {
        return await this.resolveArray(data, indexes)
    }

    /**
     * 
     * @param {Object} data 
     * @returns {Promise<Object|undefined>}
     */
    async execute(data) {
        return await require(`../Functions/${this.mainFunction.key.slice(1)}`)(this, data)
    }

    deflate(replacer) {
        return {
            id: this.id,
            replace: this.total,
            with: replacer ?? ""
        }
    }

    /**
     * 
     * @param {string[]|number[]} indexes
     * @param {import("../util/Constants").ExecutionData} data 
     * @returns {Promise<string[]|undefined>}
     */
    async resolveArray(data, indexes = []) {
        if (this.isProperty) return undefined
        const arr = []
        let y = 0
        for (const field of this.fields) {
            if (indexes.includes(y)) {
                arr.push(field)
                y++ 
                continue
            } else y++
            const fns = this.overloadsFor(field)
            if (fns.length) {
                let text = field
                for (const fn of fns) {
                    const execution = await fn.execute(data)
                    if (!execution) return undefined
                    text = text.replace(execution.id, execution.with)
                }
                arr.push(text)
            } else {
                arr.push(field)
            }
        }

        const resolved = []

        for (let i = 0;i < this.mainFunction.params.length;i++) {
            const param = this.mainFunction.params[i]
            let response = arr[i]

            if (param.required && !response) {
                return this.sendError(data.mainChannel, `:x: Missing arguments in \`${this.image}\`!`)
            }

            if (!param.required && !response && param.default !== undefined) {
                response = typeof param.default === "function" ? param.default(data.message) ?? "" : param.default
            }

            if (indexes.includes(i)) {
                resolved.push(response)
                continue
            }

            if (!response) {
                resolved.push(response) 
                continue
            }

            if (!param.rest) {
                const arg = await this._getArg(response, param, data, resolved)
                if (arg === undefined) return undefined
                else resolved.push(arg)
            } else {
                for (const res of arr.slice(i)) {
                    const arg = await this._getArg(res, param, data, resolved)
                    if (arg === undefined) return undefined
                    else resolved.push(arg)
                }
            }
        }

        return resolved
    }

    /**
     * @param {Object} target
     * @param {import("../util/Constants").ExecutionData} source  
     * @returns {import("../util/Constants").ExecutionData}
     */
    _clone(target, source) {
        for (const [
            key, val
        ] of Object.entries(source)) {
            if (target[key] === undefined) target[key] = val
        }
        return target
    }

    /**
     * @private
     * @param {string} current 
     * @param {any[]} resolved
     * @param {import("../util/Constants").Param} param 
     * @param {import("../util/Constants").ExecutionData} data 
     * @returns {Promise<any|undefined>}
     */
    async _getArg(current, param, data, resolved) {
        const reject = () => {
            this.sendError(data.mainChannel, `:x: Argument \`${current}\` is not valid for type **${param.resolveType[0] + param.resolveType.slice(1).toLowerCase()}** in \`${this.image}\``)
            return undefined
        }

        let response = current; 

        //const reference = param.source !== undefined ? resolved[param.source] : data

        if (param.resolveType === "NUMBER") {
            const n = Number(current)
            if (isNaN(n)) return reject()
            response = n 
        } else if (param.resolveType === "TIME") {
            response = ms.parseString(response)
            if (response === undefined) return reject()
        } else if (param.resolveType === "CHANNEL") {
            response = data.client.channels.cache.get(response)
            if (!response) return reject()
        } else if (param.resolveType === "USER") {
            if (!Constants.REGEXES.ID.test(response)) return reject()
            response = await data.client.users.fetch(response).catch(() => null)
            if (!response) return reject()
        } else if (param.resolveType === "GUILD") {
            response = data.client.guilds.cache.get(response)
            if (!response) return reject()
        } else if (param.resolveType === "ROLE") {
            const reference = param.source !== undefined ? resolved[param.source] : data.client.guilds.cache.get(response)
            if (!reference) return reject()
            response = reference.roles.cache.get(response)
            if (!response) return reject()
        } else if (param.resolveType === "MEMBER") {
            const reference = param.source !== undefined ? resolved[param.source] : data.client.guilds.cache.get(response)
            if (!reference) return reject()
            response = await reference.members.fetch(response).catch(() => null)
            if (!response) return reject()
        } else if (param.resolveType === "BOOLEAN") {
            if (typeof response !== "boolean") {
                const falsy = ["no", "false"]
                const truthy = ["yes", "true"]
                const all = falsy.concat(truthy)
                if (!all.includes(response)) return reject()
                if (falsy.includes(response)) {
                    response = false
                } else if (truthy.includes(response)) {
                    response = true
                }
            }
        }

        return response
    }

    /**
     * 
     * @param {Object} data 
     * @param {string} code 
     * @returns {Promise<string|undefined>}
     */
    async resolveCode(data, code) {
        if (this.isProperty) return undefined
        const loads = this.overloadsFor(code)
        for (const load of loads) {
            const res = await load.execute(data)
            if (!res) return undefined
            else code = code.replace(res.id, res.with)
        }
        return code
    }
}