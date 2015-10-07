var broccoli = require('broccoli');
var path     = require('path');
var expect   = require('expect.js');
var fs       = require('fs-extra');
var _        = require('lodash');
var temp     = require('temp').track();
var sinon    = require('sinon');

var srcDir = temp.mkdirSync('src');
fs.copySync(path.join(__dirname, 'fixtures'), srcDir);


function build(config, done, callback) {
  var BroccoliRequireJs = require('..');
  var tree = new BroccoliRequireJs(srcDir, config);
  var builder = new broccoli.Builder(tree);
  builder.build().then(function(results) {callback(tree, results);})
    .catch( function(error) {
      done(error);
    });
  return builder;
}

require('mocha-jshint')();


describe('broccoli-requirejs', function() {

  describe('runs requireJs and use the right inputs and outputs', function() {
    var now = new Date();
    var builder, forkSpy;

    before(function(done) {
      forkSpy = sinon.spy(require('child_process'), 'fork');
      var config = {
        requirejs : {
          optimize: "none",
          generateSourceMaps: true,
          name: 'index',
          out: 'dist/bundle.js'
        }
      };

      builder = build(config, done, function() {
        done();
      });
    });

    after(function() {
      require('child_process').fork.restore();
      builder.cleanup();
    });

    var srcFiles = ['index.js', 'foo.js', 'bar.js'];

    it("doesn't modifed source files", function() {
      _.forEach(srcFiles, function(file) {
        var srcMtime = fs.statSync(path.join(srcDir, file)).mtime;
        expect(srcMtime < now).to.be.ok();
      });
    });

    it("writes the results in the good repository", function() {
      var basePath = path.join(builder.tree.tmpCacheDir, 'dist');
      expect(fs.existsSync(path.join(basePath, 'bundle.js'))).to.be.ok();
      expect(fs.existsSync(path.join(basePath, 'bundle.js.map'))).to.be.ok();
    });

    it("kills the child process", function() {
      expect(forkSpy.called).to.be.ok();
      expect(forkSpy.returnValues[0].connected).to.not.be.ok();
    });
  });

  describe('regular expressions are well passed to requireJs', function() {
    var builder;

    before(function(done) {
      var config = {
        requirejs : {
          name: 'index',
          baseUrl: '.',
          fileExclusionRegExp: /useless/,
          dir: '.'
        }
      };

      builder = build(config, done, function() {
        done();
      });
    });

    after(function() {
      builder.cleanup();
    });

    it('copies all files except ones matching the regular expression', function() {
      var basePath = path.join(builder.tree.tmpCacheDir);
      console.log(fs.readdirSync(basePath));
      expect(fs.existsSync(path.join(basePath, 'useless.js'))).to.not.be.ok();
      expect(fs.existsSync(path.join(basePath, 'unused.js'))).to.be.ok();
    });
  });
});
