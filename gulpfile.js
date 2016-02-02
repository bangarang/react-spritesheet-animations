var gulp = require('gulp');
var rename = require("gulp-rename")
var babel = require('gulp-babel');

gulp.task('default', function() {
	return gulp.src('index.jsx')
		.pipe(babel({
			presets: ["es2015", "react"]
		}))
		.pipe(rename(function (path) {
      path.extname = ".js"
    }))
		.pipe(gulp.dest('.'));
});
