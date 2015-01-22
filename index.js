var Writer = require('broccoli-writer');
var RSVP = require('rsvp');
var requirejs = require('requirejs');
var fs = require('fs');
var path = require('path');
var _ = require('lodash');

function RequireJsFilter(inputTree, options) {
  if (!(this instanceof RequireJsFilter)) {
    return new RequireJsFilter(inputTree, options);
  }

  this.inputTree = inputTree;
  this.options = options || {};
}

RequireJsFilter.prototype = Object.create(Writer.prototype);
RequireJsFilter.prototype.constructor = RequireJsFilter;

RequireJsFilter.prototype.write = function (readTree, destDir) {
  var options = _.cloneDeep(this.options.requirejs) || {};

  return readTree(this.inputTree).then(function (srcDir) {
    var appDir = options.appDir;
    options.appDir = appDir ? path.join(srcDir, appDir) : srcDir;

    var dir = options.dir;
    options.dir = dir ? path.join(destDir, dir) : destDir;

    if (options.mainConfigFile) {
      options.mainConfigFile = path.join(srcDir, options.mainConfigFile);
    }

    if (options.out) {
      options.out = path.join(destDir, options.out);
    }

    if (options.wrap) {
      if (options.wrap.startFile) {
        options.wrap.startFile = path.join(srcDir, options.wrap.startFile);
      }
      if (options.wrap.endFile) {
        options.wrap.endFile = path.join(srcDir, options.wrap.endFile);
      }
    }

    return new RSVP.Promise(function(resolve, reject) {
      requirejs.optimize(options, function (output) {
        console.log(output);
        resolve(output);
      }, reject);
    });
  });
};

module.exports = RequireJsFilter;
