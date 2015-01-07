# brocolli-requirejs-fc

Forked from [brocolli-requirejs](https://github.com/aaronshaf/broccoli-requirejs)

## Install

```
npm install --save-dev broccoli-requirejs
```

## Example

```js
var optimizeRequireJs = require('broccoli-requirejs');
var tree = broccoli.makeTree('lib');
tree = optimizeRequireJs(tree, {
  requirejs: {
    name: 'index',
    out: 'bundle.js'
  }
});
```

## License

MIT
