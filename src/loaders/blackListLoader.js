const { createBlackList } = require('jwt-blacklist')
const { redis } = require('../configs')

module.exports = async () => {
  return await createBlackList({
    daySize: 10000, // optional, number of tokens need revoking each day
    errorRate: 0.001, // optional, error rate each day
    storeType: 'redis', // store type
    redisOptions: {
      host: redis.host,
      port: redis.port,
      key: redis.blackListKey,
      password: redis.password
    }
  })
}
