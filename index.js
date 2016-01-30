var CachingWriter = require('broccoli-caching-writer');
var RSVP = require('rsvp');
var fork = require('child_process').fork;
var path = require('path');
var serialize = require('serialize-javascript');

RequireJsFilter.prototype = Object.create(CachingWriter.prototype);
RequireJsFilter.prototype.constructor = RequireJsFilter;
function RequireJsFilter(inputTree, options) {
  if (Array.isArray(inputTree)) {
    throw new Error('Expected a tree and not an array as first argument');
  }

  this.options = options || {};
  CachingWriter.call(this, [inputTree], {
    name: 'RequireJS filter',
    annotation: this.options.annotation,
    cacheInclude: this.options.cacheInclude,
    cacheExclude: this.options.cacheExclude
  });
}

RequireJsFilter.prototype.build = function() {
  var requirejsOptions = this.options.requirejs || {};
  var verbose = false;
  if (typeof this.options.verbose === "boolean") {
    verbose = this.options.verbose;
  }

  var options = {};
  for (var prop in requirejsOptions) {
    if (prop === 'dir' || prop === 'out') {
      options[prop] = path.join(this.outputPath, requirejsOptions[prop]);
    } else {
      options[prop] = requirejsOptions[prop];
    }
  }

  var child = fork(path.join(__dirname, 'run_optimizer.js'), [], {
    cwd: this.inputPaths[0],
    silent: verbose
  });

  return new RSVP.Promise(function(resolve, reject) {
    child.on('message', function(message){
      child.kill();
      if (message.isSuccess) {
        if (verbose) {
          console.log(message.output);
        }
        resolve(this);
      } else {
        reject(new Error(message.output));
      }
    });

    child.send('options = ' + serialize(options));
  });
};

module.exports = RequireJsFilter;
