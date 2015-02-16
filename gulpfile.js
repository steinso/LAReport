
var gulp = require('gulp');
var livereload = require('gulp-livereload');


// NOTE: I previously suggested doing this through Grunt, but had plenty of problems with
// my set up. Grunt did some weird things with scope, and I ended up using nodemon. This
// setup is now using Gulp. It works exactly how I expect it to and is WAY more concise.
var gulp = require('gulp'),
    spawn = require('child_process').spawn,
    node;
 
/**
 * $ gulp server
 * description: launch the server. If there's a server already running, kill it.
 */
gulp.task('server', function() {
  if (node) node.kill();
  node = spawn('node', ['--harmony','LAReportServer.js'], {stdio: 'inherit'});
  node.on('close', function (code) {
    if (code === 8) {
      gulp.log('Error detected, waiting for changes...');
    }
  });
});
 
/**
 * $ gulp
 * description: start the development environment
 */
gulp.task('default', function() {
  gulp.run('server');
  // Create LiveReload server
  livereload.listen({port:35729});
 
  gulp.watch(['./*.js', './lib/**/*.js'], function() {
    gulp.run('server');
  });
  
	gulp.watch(['./static/**']).on('change', livereload.changed);
});
 
// clean up if an error goes unhandled.
process.on('exit', function() {
    if (node) node.kill();
});

gulp.task('watch', function() {



});
