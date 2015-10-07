var requirejs = require('requirejs');

function success(buildResponse) {
  process.send({
    isSuccess: true,
    output: buildResponse
  });
}

function error(err) {
  err = err || {};
  process.send({
    isSuccess: false,
    output: err.message
  });
}

process.on('message', function(m) {
  var options;
  eval(m); // jshint ignore:line
  requirejs.optimize(options, success, error);
});
