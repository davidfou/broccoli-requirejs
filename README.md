# brocolli-requirejs
[![Build Status](https://travis-ci.org/dfournier/broccoli-requirejs.svg?branch=master)](https://travis-ci.org/dfournier/broccoli-requirejs)

## Install

```
npm install --save-dev broccoli-requirejs
```

## options

| Key         | Type                      | Description                                                      |
|-------------|---------------------------|------------------------------------------------------------------|
| `verbose`   | Boolean (default `false`) | Prints the result of the optimization                            |
| `requirejs` | Object                    | RequireJS options, `out` or `dir` is used to set the output tree |

## Example

```js
var optimizeRequireJs = require('broccoli-requirejs');
tree = optimizeRequireJs('lib', {
  verbose   : true,
  requirejs : {
    name : 'index',
    out  : 'bundle.js'
  }
});
```

## ZOMG!!! TESTS?!?!!?

I know, right?

Running the tests:

```bash
npm test
```

## License

This project is distributed under the MIT license.
