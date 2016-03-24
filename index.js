var service = require('server-base')
var routes = require('./routes')
var leveldb = require('leveldb-mount')
var name = require('./package.json').name

service(name, routes)
.config.assert(['PORT', 'DB_PATH'])
.start()

if (process.env.DB_REPL_PORT) {
  var dbOptions = { dbPath: process.env.DB_PATH, replCredentials: process.env.REPL_CREDENTIALS }
  leveldb.server(Number(process.env.DB_REPL_PORT), dbOptions)
}
