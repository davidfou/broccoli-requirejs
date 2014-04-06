var Transform = require('broccoli-transform');
var RSVP = require('rsvp');
var requirejs = require('requirejs');
var mkdirp = require('mkdirp');
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

RequireJsFilter.prototype = Object.create(Transform.prototype);
RequireJsFilter.prototype.constructor = RequireJsFilter;

RequireJsFilter.prototype.transform = function (srcDir, destDir) {
  var options = this.options;
  var requirejs_options = options.requirejs || {};

  return new RSVP.Promise(function(resolve, reject) {
    var tmp_options = _.clone(requirejs_options);

    if (requirejs_options.baseUrl) {
        tmp_options.baseUrl = path.join(srcDir, requirejs_options.baseUrl);
    } else {
        tmp_options.baseUrl = srcDir;
    }

    tmp_options.out = path.join(destDir,requirejs_options.out);

    requirejs.optimize(tmp_options, function (buildResponse) {
      resolve(destDir);
    });
  }.bind(this));
};

module.exports = RequireJsFilter;
