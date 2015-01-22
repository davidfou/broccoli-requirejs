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

function alwaysPrepend (options, propertyName, value) {
  var currentValue = options[propertyName];
  options[propertyName] = currentValue ? path.join(value, currentValue) : value;
}

function prependIfNotEmpty (options, propertyName, value) {
  if (options[propertyName]) {
    options[propertyName] = path.join(value, options[propertyName]);
  }
}

RequireJsFilter.prototype = Object.create(Writer.prototype);
RequireJsFilter.prototype.constructor = RequireJsFilter;

RequireJsFilter.prototype.write = function (readTree, destDir) {
  var options = _.cloneDeep(this.options.requirejs) || {};

  return readTree(this.inputTree).then(function (srcDir) {
    if (options.out) {
      prependIfNotEmpty(options, 'out', destDir);
      alwaysPrepend(options, 'baseUrl', srcDir);
    } else {
      alwaysPrepend(options, 'dir', destDir);
      alwaysPrepend(options, 'appDir', srcDir);
    }

    prependIfNotEmpty(options, 'mainConfigFile', srcDir);

    if (options.wrap) {
      prependIfNotEmpty(options.wrap, 'startFile', srcDir);
      prependIfNotEmpty(options.wrap, 'endFile', srcDir);
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
