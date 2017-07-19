'use strict';

var gulp = require('gulp');
var cssmin = require('gulp-cssmin');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var del = require('del');
var postcss = require('gulp-postcss');
var salad = require('postcss-salad')(require('./salad.config.json'));

var name = 'em-normalize';

gulp.task('clean', function (cb) {
  del(['dist/**/*'], cb);
});

gulp.task('lint-css', function lintCssTask() {
  const gulpStylelint = require('gulp-stylelint');

  return gulp
    .src('src/**/*.scss')
    .pipe(gulpStylelint({
      reporters: [
        {formatter: 'string', console: true}
      ],
      debug: true,
    }));
});

gulp.task('compile:css', function () {
  gulp.src('src/**/*.scss')
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(concat(name+'.css'))
    .pipe(postcss([salad]))
    .pipe(cssmin())
    .pipe(gulp.dest('dist'));
});

gulp.task('compile:scss', function () {
  gulp.src('src/**/*.scss')
    .pipe(postcss([salad]))
    .pipe(gulp.dest('dist'));
});

gulp.task('build', ['lint-css', 'clean', 'compile:css', 'compile:scss']);

gulp.task('default', function() {
  gulp.watch(['src/**/*.scss'], ['build']);
});
