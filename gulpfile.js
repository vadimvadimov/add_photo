'use strict';

const gulp         = require('gulp'),
	    sass         = require('gulp-sass'),
			browserSync  = require('browser-sync'),
	    concat       = require('gulp-concat'),
	    uglify       = require('gulp-uglify-es').default,
	    cleancss     = require('gulp-clean-css'),
	    autoprefixer = require('gulp-autoprefixer'),
	    rsync        = require('gulp-rsync'),
	    newer        = require('gulp-newer'),
	    rename       = require('gulp-rename'),
	    responsive   = require('gulp-responsive'),
	    babel        = require('gulp-babel');

sass.compiler = require('node-sass');

// Local Server
gulp.task('browser-sync', () => {
	browserSync({
		server: {
			baseDir: 'src/'
		},
		notify: false,
		// online: false, // Work offline without internet connection
		// tunnel: true, tunnel: 'projectname', // Demonstration page: http://projectname.localtunnel.me
	})
});

//function bsReload(done) { browserSync.reload(); done(); };

// Custom Styles
gulp.task('styles', () => {
	return gulp.src('src/sass/**/*.scss')
	.pipe(sass({ 
		outputStyle: 'expanded',
		includePaths: require('node-normalize-scss').includePaths
	}))
	.pipe(concat('main.min.css'))
	.pipe(autoprefixer({
		grid: true,
		overrideBrowserslist: ['last 10 versions']
	}))
	.pipe(cleancss( {level: { 1: { specialComments: 0 } } })) // Optional. Comment out when debugging
	.pipe(gulp.dest('src/css'))
	.pipe(gulp.dest('build/css'))
	.pipe(browserSync.stream())
});

// Scripts & JS Libraries
gulp.task('scripts', () => {
	return gulp.src([
		//'node_modules/jquery/dist/jquery.min.js',
		//'node_modules/bootstrap/dist/js/bootstrap.bundle.min.js',
		//'src/js/_lazy.js', // JS library plug-in example
		'src/js/main.js', // Custom scripts. Always at the end
		])
	.pipe(babel({
		presets: ['@babel/env']
	}))
	.pipe(concat('main.min.js'))
	//.pipe(uglify()) // Minify js (opt.)
	.pipe(gulp.dest('src/js'))
	.pipe(gulp.dest('build/js'))
	.pipe(browserSync.reload({ stream: true }))
});

//copy files
gulp.task('copy_fonts', () => {
	gulp.src('./src/fonts/*.*')
	.pipe(gulp.dest('./build/fonts/'))
});

gulp.task('copy_php', () => {
	gulp.src('./src/php/*.*')
	.pipe(gulp.dest('./build/php/'))
});

gulp.task('copy_json', () => {
	gulp.src('./src/*.*')
	.pipe(gulp.dest('./build/'))
})

// HTML Live Reload
gulp.task('html', () => {
	return gulp.src('src/**/*.html')
	.pipe(gulp.dest('build/'))
	.pipe(browserSync.reload({ stream: true }))
});

gulp.task('watch', () => {
	gulp.watch('src/sass/**/*.scss', gulp.parallel('styles'));
	gulp.watch('src/sass/**/*.sass', gulp.parallel('styles'));
	gulp.watch(['libs/**/*.js', 'src/js/main.js'], gulp.parallel('scripts'));
	gulp.watch('src/*.html', gulp.parallel('html'));
});

gulp.task(
	'default', 
	gulp.parallel(
		'styles', 
		'scripts', 
		'browser-sync', 
		'watch', 
		'html',
		'copy_php',
		'copy_json'
	)
);