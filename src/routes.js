var fontelloMount = require('fontello-mount')
var store = require('./store')
var fs = require('fs')
var crypto = require('crypto')
var path = require('path')
var leveldb = require('leveldb-mount')
module.exports = routes

function routes (router) {
  if (process.env.DB_REPL_PORT === process.env.PORT) {
    var replRoutes = leveldb.routes(process.env.DB_PATH, { replCredentials: process.env.REPL_CREDENTIALS })
    router.set('/repl.js', (q, r) => replRoutes.js(q, r))
    router.set('/repl.html', (q, r) => replRoutes.html(q, r))
  }
  ;['client.js', '/', 'client.css']
  .map((client) =>
    router.set(client, (q, r) => {
      fs.createReadStream(path.join(__dirname, (client === '/' ? 'client.html' : client)))
      .pipe(r)
    })
  )
  router.set('/:hash/fontello/*', (q, r, params) => {
    store.getConfig(params.hash, (err, config) => {
      if (err) return this.notFound(q, r)
      fontello(config, (err, route, cache) => {
        if (err) return this.errorReply(q, r)
        var key = q.url.replace('/' + params.hash, '').split('?')[0]
        var etag = createEtag(params.hash, key)
        if (q.headers['if-none-match'] === etag) {
          r.writeHead(304)
          return r.end()
        }
        var file = cache.files[key]
        if (!file) return this.notFound(q, r)
        var data = Buffer.from(file)
        r.writeHead(200, {
          'content-type': cache.types[key],
          'etag': etag,
          'last-modified': new Date().toGMTString(),
          'content-length': data.length
        })
        r.end(data)
      })
    })
  })

  router.set('/lasthash', (q, r) => {
    store.getLastHash((_, hash) => {
      r.end(hash || '')
    })
  })

  router.set('/upload/config.json', (q, r) => {
    this.jsonBody(q, r, config => {
      var errorReply = (err) => this.errorReply(q, r, err)
      fontello(config, (err, route, cache, store) => {
        if (err) return errorReply(err)
        store.updateLastHash((err) => {
          if (err) return errorReply(err)
          r.end(store.hash())
        })
      })
    })
  })
}

function fontello (config, cb) {
  var cacheStore = store(config)
  fontelloMount(config, { cache: cacheStore }, (err, route, cache) => {
    if (err) return cb(err)
    cb(null, route, cache, cacheStore)
  })
}

function createEtag (hash, key) {
  var sha1 = crypto.createHash('sha1')
  return sha1.update(hash + key).digest('hex')
}
