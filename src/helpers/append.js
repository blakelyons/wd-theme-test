module.exports = function(str, suffix) {
    if (typeof str === 'string' && typeof suffix === 'string') {
        return str + suffix;
    }
    return str;
};