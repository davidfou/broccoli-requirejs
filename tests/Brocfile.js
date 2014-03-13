module.exports = function (broccoli) {
  var optimizeRequireJs = require('../index.js');

  var tree = broccoli.makeTree('bundle');

  tree = optimizeRequireJs(tree, {
    requirejs: {
      optimize: "none",
      generateSourceMaps: true,
      baseUrl: 'bundle',
      name: 'index',
      out: 'bundle.js'
    }
  });

  return [tree];
};
