# fontello-server

fontello cdn server

Fonts are persisted in leveldb.

Now your projects can use your fonts with no fontello setup.

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

# browse to /

Runs on port 2016

`/` supports
* Drag and drop of fontello's downloaded zip file.
* Automatic uploads to fontello-server displaying hashed links.
* Copy links to clipboard.
* Download of `config.json` file.
* Works well with [fontello] dragging files between the two windows.

As [fontello] also supports drag and drop. `config.json` and `fontello zip` can be dragged and dropped between the two windows.

# api

post config.json from [fontello] to receive a hash

```
➜ curl -T config.json -X POST http://localhost:2016/upload/config.json
sha1-hash
```

Then add the following to your index.html.

```html
<link rel="stylesheet" href="http://localhost:2016/sha1-hash/fontello/css/fontello.css" charset="utf-8">
<link rel="stylesheet" href="http://localhost:2016/sha1-hash/fontello/css/animation.css" charset="utf-8">
```

Get `config.json` for a hash

```
➜ curl http://localhost:2016/sha1-hash/fontello/config.json -o config.json
```

Updating fonts using http api

Drag the config.json to [fontello].

Then upload a new config.json downloaded from [fontello].

# Start
npm start

# Running in docker

Check out `package.json` for docker commands.


# `/repl.html`

Runs on port 2017

A leveldb repl is available if the server is started with env variable `REPL_CREDENTIALS` set

If security matters then run docker with -e REPL_CREDENTIALS `user:pass`
is the default.

Checkout [leveldb-mount] for details.

# license

MIT

[fontello]:http://fontello.com/
[leveldb-mount]:http://npm.im/leveldb-mount
