// gulpfile.js
// Include gulp
var gulp = require('gulp');

// npm install --save gulp gulp-jshint gulp-sass gulp-concat gulp-uglify gulp-rename gulp-nodemon

// npm install --save-dev gulp-jshint gulp-concat gulp-uglify browserify reactify require-globify vinyl-source-stream vinyl-buffer gulp-uglify babel-core babel-loader babel-preset-es2015 babel-preset-react babel-register

var babelify = require("babelify");

// Include Our Plugins
var concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
  browserify = require('browserify'),
  reactify = require('reactify'),
	globify = require('require-globify'),
  source = require('vinyl-source-stream'),
	buffer = require('vinyl-buffer'),
	uglify = require('gulp-uglify');

var babelify = require("babelify");

// Compile Our React Stuff
gulp.task('react', function() {
    // Browserify/bundle the JS.
		// browserify -t reactify -t require-globify public/index.js -o public/bundle.js
    browserify('./index.jsx')
				.transform(babelify, {presets: ["es2015", "react"]})
				.transform([globify])
        .bundle()
        .pipe(source('index.js'))
				.pipe(buffer())
				.pipe(uglify())
        .pipe(gulp.dest('./'));
});

// Default Task
// gulp.task('default', ['lint', 'sass', 'scripts', 'watch']);
gulp.task('default', ['react']);
