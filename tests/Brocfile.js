module.exports = function (broccoli) {
  var optimizeRequireJs = require('../lib/index.js');

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

 // styles = pickFiles(styles, {
 //    srcDir: '/',
 //    destDir: 'appkit'
 //  })

  return [tree];
};
