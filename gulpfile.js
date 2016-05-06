var gulp = require('gulp'); // for gulp
var sass = require('gulp-sass'); // for sass
var sourcemaps = require('gulp-sourcemaps');
var slim = require('gulp-slim');
var plumber = require('gulp-plumber'); // sass error handling
var browserSync = require('browser-sync').create(); // for live css reload
var useref = require('gulp-useref'); // file concatenation
var uglify = require('gulp-uglify'); // minify js
var cssnano = require('gulp-cssnano'); // minify css
var gulpIf = require('gulp-if'); // conditionally run a task
var imagemin = require('gulp-imagemin'); // minify images
var cache = require('gulp-cache'); // cache proxy
var del = require('del'); // delete files/folders using globs - needed to delete 'dist' directory before build
var runSequence = require('run-sequence'); // run series of dependent gulp tasks in order

//convert slim to html
gulp.task('slim', function(){
	return gulp.src('app/*.slim')
		.pipe(slim({
			pretty: true,
			require: 'slim/include',
			options: 'include_dirs=["app", "app/partials"]'
		}))
		.pipe(gulp.dest('build'))
});

// convert sass to css
gulp.task('sass', function(){
	return gulp.src('app/scss/**/*.scss')
		.pipe(sourcemaps.init())
		.pipe(plumber())
		.pipe(sass({ouputStyle: ''}).on('error', sass.logError))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('build/css'))
		.pipe(browserSync.reload({
			stream: true
		}))
});

// live reload
gulp.task('browserSync', function(){
	browserSync.init({
		server: {
			baseDir: 'build'
		},
	});
});

// concatenate html partials; concatenate and minify css and js partials
gulp.task('useref', function(){
	return gulp.src('build/*.html')
		.pipe(useref())
		.pipe(gulpIf('*.js', uglify()))
		.pipe(gulpIf('*.css', cssnano())
		.pipe(gulp.dest('build'))
		.pipe(browserSync.reload({
			stream: true
		}))
});

// minify images
gulp.task('images', function(){
	return gulp.src('app/images/**/*.+(png|jpg|jpeg|gif|svg)')
		.pipe(cache(imagemin({
			interlaced: true
		})))
		.pipe(gulp.dest('build/images'))
});

// move fonts to build
gulp.task('fonts', function(){
	return gulp.src('app/fonts/**/*')
		.pipe(gulp.dest('build/fonts'))
});

//remove dist folder before build
gulp.task('clean:build', function(){
	return del.sync('build')
});

// watch for reload
gulp.task('default', ['sass','slim','images','useref','browserSync'], function(){
	gulp.watch('app/**/*.slim',['slim','useref']);
	gulp.watch('app/scss/**/*.scss',['sass']);
	gulp.watch('app/js/*.js',['useref']);
	gulp.watch('app/images/*',['images']);
});

// build files
gulp.task('build', function(callback){
	runSequence('clean:build', ['sass','slim', 'images', 'fonts'], 'useref',
		callback
	)
});