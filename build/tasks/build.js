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
  return buildModule('es6', 'es6');
});

gulp.task('build-commonjs', function () {
  return buildModule('es5', 'commonjs');
});

gulp.task('build-amd', function () {
  return buildModule('es5', 'amd');
});

gulp.task('build-system', function () {
  return buildModule('es5', 'system');
});

function buildModule(target, targetName) {
  var tsResult = gulp.src([
    paths.output + tsName, 
    paths.aureliaDependenciesDefinitions])
    .pipe(sourcemaps.init())
    .pipe(ts(assign({}, compilerOptions, {"target":target,"module":targetName})));

  return merge([
    tsResult.dts.pipe(gulp.dest(paths.output + targetName)),
    tsResult.js
      .pipe(sourcemaps.write())    
      .pipe(gulp.dest(paths.output + targetName))
  ]);
}

gulp.task('copy-dts-for-docs', function () {
  return gulp.src([
      paths.output + 'es6/*.d.ts'
    ])
    .pipe(gulp.dest(paths.output));
});

gulp.task('build', function(callback) {
  return runSequence(
    'clean',
    'build-index',
    ['build-es6', 'build-commonjs', 'build-amd', 'build-system'],
    'copy-dts-for-docs',
    callback
  );
});
