var gulp = require('gulp');
var jsx = require('gulp-jsx');
var rename = require("gulp-rename")

// npm install --save-dev gulp gulp-jsx gulp-rename

gulp.task('build', function() {
  return gulp.src('index.jsx')
    .pipe(jsx({
      factory: 'React.createClass'
    }))
    .pipe(rename(function (path) {
      path.extname = ".js"
    }))
    .pipe(gulp.dest('.'));
});

// Default Task
// gulp.task('default', ['lint', 'sass', 'scripts', 'watch']);
gulp.task('default', ['build']);
