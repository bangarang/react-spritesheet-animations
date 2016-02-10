var gulp = require('gulp'),
		rename = require("gulp-rename"),
		babel = require('gulp-babel'),
		browserify = require('browserify'),
		source = require('vinyl-source-stream'),
		globify = require('require-globify'),
		buffer = require('vinyl-buffer'),
		babelify = require("babelify");


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

// gulp.task('build-example', function() {
// 	return gulp.src('./example/example.jsx')
// 		.pipe(babel({
// 			presets: ["es2015", "react"]
// 		}))
// 		.pipe(rename(function (path) {
//       path.extname = ".js"
//     }))
// 		.pipe(gulp.dest('./example'));
// });


gulp.task('build-example', function() {
    // Browserify/bundle the JS.
		// browserify -t reactify -t require-globify public/index.js -o public/bundle.js

		// var manifest = gulp.src("./rev-manifest.json");

    browserify('./example/example.jsx')
				.transform(babelify, {presets: ["es2015", "react"]})
				.transform([globify])
        .bundle()
        .pipe(source( "example.js" ))
				.pipe(buffer())
        .pipe(gulp.dest('./example'));
});
