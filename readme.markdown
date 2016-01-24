# fontello-server

fontello server

fonts are persisted in leveldb.

Now your projects can use your fonts with no fontello setup.

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

# usage

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

# Get `config.json` for a hash

```
curl http://localhost:2016/sha1-hash/fontello/config.json -o config.json
```

# client.html

* Drag and drop fontello's downloaded zip file
* Copy links to clipboard
* Download `config.json`

# Updating fonts using http api

Drag the config.json to [fontello].

Then upload a new config.json downloaded from [fontello].

# Docker support

Check out `package.json` for docker commands.

# license

MIT

[fontello]:http://fontello.com/
