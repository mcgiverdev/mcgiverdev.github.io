var gulp = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const { watch, series } = require("gulp");
const imagemin = require("gulp-imagemin");
//npm install gulp --save --only=dev
gulp.task("hello", function () {
  console.log("hello!!");
});
gulp.task("imagemin", () => {
  return gulp
    .src("src/assets/images/**/*")
    .pipe(imagemin())
    .pipe(gulp.dest("public/images"));
});
gulp.task("sass", function () {
  return gulp
    .src("src/scss/**/**/*.scss")
    .pipe(sass())
    .pipe(gulp.dest("public/css"));
});
gulp.task("sass-skins", function () {
  return gulp
    .src("src/scss/**/**/*.scss")
    .pipe(sass())
    .pipe(gulp.dest("public/css/skins/"));
});
gulp.task("watch", () => {
  watch("src/scss/**/*.scss", series("sass"));
});
