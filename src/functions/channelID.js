module.exports = (fn, d) => {
    return fn.deflate(d.message?.channel.id ?? "")
}