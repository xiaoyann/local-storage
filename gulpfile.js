var path = require('path');
var gulp = require('gulp');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var exec = require('child_process').exec;
var license = require('gulp-header-license');

var DIST_DIR = path.resolve(__dirname, './dist');
var SRC_FILE = path.resolve(__dirname, './src/index.js');

exec('rm -rf ' + DIST_DIR, function(err, out) {
});

gulp.task('default', function() {
	return gulp.src(SRC_FILE)
		.pipe(jshint())
		.pipe(jshint.reporter('default'))
		.pipe(jshint.reporter('fail'))
		.pipe(rename({basename: 'main'}))
		.pipe(gulp.dest(DIST_DIR))
		.pipe(uglify({preserveComments: {all: true}}))
		.pipe(rename({basename: 'main.min'}))
		.pipe(gulp.dest(DIST_DIR));
});