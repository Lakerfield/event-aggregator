var gulp = require('gulp');
var runSequence = require('run-sequence');
var ts = require('gulp-typescript');
var sourcemaps = require('gulp-sourcemaps');
var merge = require('merge2');
var paths = require('../paths');
var compilerOptions = require('../ts-options');
var assign = Object.assign || require('object.assign');
var rename = require('gulp-rename');

var tsName = paths.packageName + '.ts';

gulp.task('build-index', function(){
  return gulp.src(paths.root + 'index.ts')
    .pipe(rename(tsName))
    .pipe(gulp.dest(paths.output));
});

gulp.task('build-es6', function () {
  return buildModule('es6', 'es6', 'es6');
});

gulp.task('build-commonjs', function () {
  return buildModule('es5', 'commonjs', 'commonjs');
});

gulp.task('build-amd', function () {
  return buildModule('es5', 'amd', 'amd');
});

gulp.task('build-system', function () {
  return buildModule('es5', 'system', 'system');
});

function buildModule(target, moduleType, dirName) {
  var tsResult = gulp.src([
    paths.output + tsName, 
    paths.typings])
    .pipe(sourcemaps.init())//{loadMaps: true}
    .pipe(ts(assign({}, compilerOptions, {"target":target,"module":moduleType})));

  return merge([
    tsResult.dts.pipe(gulp.dest(paths.output + dirName)),
    tsResult.js
      .pipe(sourcemaps.write('.', {includeContent: true}))    
      .pipe(gulp.dest(paths.output + dirName))
  ]);
}

gulp.task('build', function(callback) {
  return runSequence(
    'clean',
    'build-index',
    ['build-es6', 'build-commonjs', 'build-amd', 'build-system'],
    callback
  );
});
