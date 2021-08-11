var gulp = require("gulp");
var rename = require("gulp-rename");

gulp.task(
  "default",
  gulp.parallel(
    () => {
      return gulp.src("./build/static/css/main.*.chunk.css").pipe(rename("./buildtoembed/main.assets_wfa_widget.chunk.css")).pipe(gulp.dest("."));
    },
    () => {
      return gulp.src("./build/static/js/runtime-main.*.js").pipe(rename("./buildtoembed/runtime-main.assets_wfa_widget.js")).pipe(gulp.dest("."));
    },
    () => {
      return gulp.src("./build/static/js/2.*.chunk.js").pipe(rename("./buildtoembed/2.assets_wfa_widget.chunk.js")).pipe(gulp.dest("."));
    },
    () => {
      return gulp.src("./build/static/js/main.*.chunk.js").pipe(rename("./buildtoembed/main.assets_wfa_widget.chunk.js")).pipe(gulp.dest("."));
    },
    () => {
      return gulp.src("./build/static/media/**/*").pipe(gulp.dest("./buildtoembed/static/media"));
    }
  )
);
