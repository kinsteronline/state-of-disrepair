'use strict';

var gulp = require("gulp");
var six2five = require("gulp-6to5");
var eslint = require("gulp-eslint");

var browserSync = require("browser-sync");


gulp.task("six2five", function() {
  return gulp.src("src/*.js")
    .pipe(six2five())
    .pipe(gulp.dest(""));
});

gulp.task("lint", function() {
  return gulp.src("src/*.js")
    .pipe(eslint())
    .pipe(eslint.format());
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

gulp.task("default", [ "lint", "six2five", "browser-sync" ], function() {
  gulp.watch([ "src/*.js" ], [ "lint", "six2five", browserSync.reload ]);
  gulp.watch([ "spec/*.js" ], browserSync.reload);
});
