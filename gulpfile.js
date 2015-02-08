'use strict';

var gulp = require("gulp");
var six2five = require("gulp-6to5");
var jshint = require("gulp-jshint");

var browserSync = require("browser-sync");


gulp.task("six2five", function() {
  return gulp.src("src/*.js")
    .pipe(six2five())
    .pipe(gulp.dest(""));
});

gulp.task("jshint", function() {
  return gulp.src("src/*.js")
    .pipe(jshint())
    .pipe(jshint.reporter("jshint-stylish"))
});

gulp.task("browser-sync", function() {
  browserSync({
    open: false,
    server: {
      baseDir: "./",
      index: "SpecRunner.html"
    }
  });
});

gulp.task("default", [ "jshint", "six2five", "browser-sync" ], function() {
  gulp.watch([ "src/*.js" ], [ "jshint", "six2five", browserSync.reload ]);
  gulp.watch([ "spec/*.js" ], browserSync.reload);
});
