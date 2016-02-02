var gulp = require('gulp');
var jsx = require('gulp-jsx');
var rename = require("gulp-rename")

// npm install --save-dev gulp gulp-jsx gulp-rename

gulp.task('build', function() {
  return gulp.src('index.jsx')
    .pipe(jsx())
    .pipe( rename(function (path) {
      path.extname = ".js"
    }))
    .pipe(gulp.dest('dist'));
});
