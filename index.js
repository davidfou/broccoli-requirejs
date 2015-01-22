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
  var options = this.options;
  var requirejs_options = options.requirejs || {};

  return readTree(this.inputTree).then(function (srcDir) {
    var tmp_options = _.clone(requirejs_options);

    if (requirejs_options.baseUrl) {
        tmp_options.baseUrl = path.join(srcDir, requirejs_options.baseUrl);
    } else {
        tmp_options.baseUrl = srcDir;
    }

    if (requirejs_options.mainConfigFile) {
      tmp_options.mainConfigFile = path.join(srcDir, requirejs_options.mainConfigFile);
    }

    tmp_options.out = path.join(destDir,requirejs_options.out);

    return new RSVP.Promise(function(resolve, reject) {
      requirejs.optimize(tmp_options, function (buildResponse) {
        resolve(destDir);
      }, reject);
    }.bind(this));
  });
};

module.exports = RequireJsFilter;
