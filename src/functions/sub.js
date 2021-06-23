module.exports = async (fn, data) => {
    const array = await fn.resolveArray(data)

    if (array === undefined) return undefined

    return fn.deflate(array.reduce((x, y) => Number(x) - Number(y)))
} 
