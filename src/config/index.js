var _exports = {}
_exports = process.env.NODE_ENV === 'production' ? require('./prod.config.js') : require('./env.config.js')
module.exports = _exports