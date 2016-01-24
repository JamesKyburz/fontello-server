var fontelloMount = require('fontello-mount')
var store = require('./store')
var leveldb = require('leveldb-mount').routes()
var fs = require('fs')
module.exports = routes

function routes (router) {
  ;['client.js', 'client.html', 'client.css']
  .map(client =>
       router.set(client, (q, r) => fs.createReadStream(client).pipe(r))
  )
  router.set('/:hash/fontello/*', (q, r, params) => {
    store.getConfig(params.hash, (err, config) => {
      if (err) return this.notFound(q, r)
      fontello(config, (err, route, cache) => {
        if (err) return this.errorReply(q, r)
        q.url = q.url.replace('/' + params.hash, '')
        route(q, r, this.notFound.bind(this, q, r))
      })
    })
  })

  router.set('/upload/config.json', (q, r) => {
    this.jsonBody(q, r, config => {
      fontello(config, (err, route, cache) => {
        if (err) return this.errorReply(q, r, err)
        r.end(cache.hash())
      })
    })
  })

  if (!process.env.REPL_CREDENTIALS) return
  router.set('/repl.html', leveldb.html)
  router.set('/repl.js', leveldb.js)
}

function fontello (config, cb) {
  var cache = store(config)
  fontelloMount(config, { cache: cache }, (err, route) => {
    if (err) return cb(err)
    cb(null, route, cache)
  })
}
