var crypto = require('crypto')
var stringify = require('json-stable-stringify')
var leveldb = require('leveldb-mount').db(process.env.DB_PATH)

module.exports = cacheStore

cacheStore.getConfig = getConfig
cacheStore.getLastHash = getLastHash

function updateLastHash (hash, cb) {
  leveldb.put('lasthash', hash, cb)
}

function getLastHash (cb) {
  leveldb.get('lasthash', cb)
}

cacheStore.getConfig = getConfig

function getConfig (hash, cb) {
  var db = leveldb.namespace(hash)
  db.get('config', cb)
}

function cacheStore (config) {
  var hash = sha1(config)

  var db = leveldb.namespace(hash)

  return { get, put, hash: () => hash, updateLastHash: (cb) => updateLastHash(hash, cb) }

  function get (cb) {
    var stream = db.createReadStream()
    var cache = {}
    stream.on('data', (item) => {
      cache[item.key] = item.value
    })
    stream.on('error', cb)
    stream.on('end', () => {
      if (Object.keys(cache).length === 0) return cb(new Error(`no cache for ${hash}`))
      var type = cache.types
      delete cache.types
      delete cache.config
      cb(null, {
        files: cache,
        types: type
      })
    })
  }

  function put (assets, cb) {
    var batch = Object.keys(assets.files).map(key => {
      return {
        type: 'put',
        key: key,
        value: assets.files[key]
      }
    })
    batch.push({
      type: 'put',
      key: 'config',
      value: config
    })
    batch.push({
      type: 'put',
      key: 'types',
      value: assets.types
    })
    db.batch(batch, cb)
  }
}

function sha1 (config) {
  var hash = crypto.createHash('sha1')
  var value = stringify(config)
  return hash.update(value).digest('hex')
}
