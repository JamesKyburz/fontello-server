var service = require('server-base')
var routes = require('./routes')
var leveldb = require('leveldb-mount')
var name = require('../package.json').name

var server = service(name, routes)
.config.assert(['PORT', 'DB_PATH'])
.start()

var replPort = process.env.DB_REPL_PORT
var port = process.env.PORT

if (replPort) {
  leveldb.server(
    replPort === port ? server : Number(replPort),
    process.env.DB_PATH, { replCredentials: process.env.REPL_CREDENTIALS }
  )
}
