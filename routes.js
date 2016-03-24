var fontelloMount = require('fontello-mount')
var store = require('./store')
var fs = require('fs')
var crypto = require('crypto')
module.exports = routes

function routes (router) {
  ;['client.js', '/', 'client.css']
  .map(client =>
    router.set(client, (q, r) => fs.createReadStream(client === '/' ? 'client.html' : client).pipe(r))
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
        var data = new Buffer(file)
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

  router.set('/upload/config.json', (q, r) => {
    this.jsonBody(q, r, config => {
      fontello(config, (err, route, cache, store) => {
        if (err) return this.errorReply(q, r, err)
        r.end(store.hash())
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
