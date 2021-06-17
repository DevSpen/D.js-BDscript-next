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
            let image = `${this.mainFunction.key}[${this.inside}]`
            for (const overload of this.overloads) {
                image = image.replace(overload.id, overload.image)
            }
            return image
        }
    }

    sendError(channel, ...data) {
        if (!channel) return undefined

        const created = data.length === 1 ? data : `:x: Invalid ${data[0]} \`${data[1]}\` in \`${this.image}\`!`

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
        if (this.mainFunction.brackets) {
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
        if (this.isProperty) return undefined
        const array = await this.resolveArray(data)
        if (!array) return undefined
        else array.join(";")
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
            with: replacer
        }
    }

    /**
     * 
     * @param {Object} data 
     * @returns {Promise<string[]|undefined>}
     */
    async resolveArray(data) {
        if (this.isProperty) return undefined
        const arr = []
        for (const field of this.fields) {
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
        return arr
    }

    /**
     * 
     * @param {Object} data 
     * @param {string} code 
     * @returns {Promise<string|undefined>}
     */
    async resolveCode(data, code) {
        if (this.isProperty) return undefined
        
    }
}