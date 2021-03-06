var gulp = require('gulp'); // for gulp
var compass = require('gulp-compass'); // for compass
var sourcemaps = require('gulp-sourcemaps');
var slim = require('gulp-slim');
var plumber = require('gulp-plumber');
var browserSync = require('browser-sync').create(); // for live css reload
var uglify = require('gulp-uglify'); // minify js
var cssnano = require('gulp-cssnano'); // minify css
var gulpIf = require('gulp-if'); // conditionally run a task
//var imagemin = require('gulp-imagemin'); // minify images
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

// convert compass to css
gulp.task('compass', function(){
	return gulp.src('app/scss/**/*.scss')
		//.pipe(sourcemaps.init())
		.pipe(plumber({
	    	errorHandler: function (error) {
				console.log(error.message);
				this.emit('end');
	    	}
	    }))
		.pipe(compass({
			css: 'build/css',
			sass: 'app/scss',
			image: 'build/images',
			sourcemap: true,
			style: 'compressed'
		}))
		.on('error', function(err) {
	      // Would like to catch the error here 
	    })
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

//move js files
gulp.task('js', function(){
	return gulp.src('app/js/**/*')
		.pipe(uglify())
		.pipe(gulp.dest('build/js'))
});

// minify images
gulp.task('images', function(){
	return gulp.src('app/images/**/*')
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
gulp.task('default', ['compass','slim','js','images','browserSync'], function(){
	gulp.watch('app/**/*.slim',['slim']);
	gulp.watch('app/scss/**/*.scss',['compass']);
	gulp.watch('app/js/*.js',['js']);
	gulp.watch('app/images/*',['images']);
});

// build files
gulp.task('build', function(callback){
	runSequence('clean:build', ['compass','slim', 'js', 'images', 'fonts'],
		callback
	)
});