let keys = process.env.NODE_ENV === 'production' ? require('./prod_keys') : require('./dev_keys')

module.exports = keys