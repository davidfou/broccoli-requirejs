# broccoli-requirejs
[![Build Status](https://travis-ci.org/dfournier/broccoli-requirejs.svg?branch=master)](https://travis-ci.org/dfournier/broccoli-requirejs)

## Install

```
npm install --save-dev broccoli-requirejs
```

## options

| Key            | Mandatory | Type                      | Description                                                                                           |
|:---            |   :---:   | :---                      | :---                                                                                                  |
| `verbose`      |   :-1:    | Boolean (default `false`) | Prints the result of the optimization                                                                 |
| `cacheInclude` |   :-1:    | Array                     | See (CachingWriter documentation)[https://github.com/ember-cli/broccoli-caching-writer#documentation] |
| `cacheExclude` |   :-1:    | Array                     | See (CachingWriter documentation)[https://github.com/ember-cli/broccoli-caching-writer#documentation] |
| `requirejs`    |   :+1:    | Object                    | RequireJS options, `out` or `dir` is used to set the output tree                                      |

## Example

```js
var RequireJs = require('broccoli-requirejs');
var tree = new RequireJS('lib', {
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
