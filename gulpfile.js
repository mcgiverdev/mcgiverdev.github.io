var gulp = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const { watch, series } = require("gulp");
//npm install gulp --save --only=dev
gulp.task("hello", function () {
  console.log("hello!!");
});
gulp.task("sass", function () {
  return gulp
    .src("scss/**/**/*.scss")
    .pipe(sass())
    .pipe(gulp.dest("public/css"));
});
gulp.task("sass-skins", function () {
  return gulp
    .src("scss/**/**/*.scss")
    .pipe(sass())
    .pipe(gulp.dest("public/css/skins/"));
});
gulp.task("watch", () => {
  watch("scss/**/*.scss", series("sass"));
});
