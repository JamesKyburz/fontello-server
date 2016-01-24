# fontello-server

fontello cdn server

Fonts are persisted in leveldb.

Now your projects can use your fonts with no fontello setup.

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

# usage with /client.html

`/client.html` supports 
* Drag and drop of fontello's downloaded zip file.
* Automatic uploads to fontello-server displaying hashed links.
* Copy links to clipboard.
* Download of `config.json` file.
* Works well with [fontello] draging files between the two windows.

# usage http api

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

A leveldb repl is available if the server is started with env variable `REPL_CREDENTIALS` set

Checkout [leveldb-mount] for details.

# license

MIT

[fontello]:http://fontello.com/
[leveldb-mount]:http://npm.im/leveldb-mount