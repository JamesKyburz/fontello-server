# fontello-server

fontello server

fonts are persisted in leveldb

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

# usage

post config.json from [fontello] to receive a hash

```
➜ curl -T config.json -X POST http://localhost:2016/upload/config.json
sha1-hash
```

Then add the following to your index.html.

```html
<link rel="stylesheet" href="fontello/css/fontello.css" charset="utf-8">
<link rel="stylesheet" href="fontello/css/animation.css" charset="utf-8">
```

Check out `package.json` for docker commands.

# license

MIT

[fontello]:http://fontello.com/
