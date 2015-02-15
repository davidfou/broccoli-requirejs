var Writer    = require('broccoli-writer');
var RSVP      = require('rsvp');
var fork      = require('child_process').fork;
var fs        = require('fs');
var path      = require('path');
var _         = require('lodash');

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
  var filterOptions = _.omit(this.options, 'requirejs');
  _(filterOptions).defaults({
    verbose: false
  });

  var options = _.cloneDeep(this.options.requirejs) || {};

  _(['dir', 'out']).forEach( function(key) {
    if (options[key])
      options[key] = path.join(destDir, options[key]);
  });

  return readTree(this.inputTree).then(function (srcDir) {
    var child = fork(path.join(__dirname, 'run_optimizer.js'), [], {
      cwd    : srcDir,
      silent : !filterOptions.verbose
    });

    return new RSVP.Promise(function(resolve, reject) {
      child.on('message', function(message){
        if (message.isSuccess) {
          resolve(this);
        } else
          reject(new Error(message.output));
      });

      child.send(options);
    });
  });
};

module.exports = RequireJsFilter;
