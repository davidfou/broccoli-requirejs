var requirejs = require('requirejs');

function success(buildResponse) {
  sendAndExit({
    isSuccess: true,
    output: buildResponse
  });
}

function error(err) {
  err = err || {};
  sendAndExit({
    isSuccess: false,
    output: err.message
  });
}

process.on('message', function(m) {
  var options;
  eval(m); // jshint ignore:line
  requirejs.optimize(options, success, error);
});

function sendAndExit(data) {
  var major = process.versions.node.match(/\d+/)[0];
  if (major >= 4) {
    process.send(data, function() {
      process.exit();
    });
  } else {
    process.send(data);
    process.exit();
  }
}