const gulp = require('gulp');
const minify = require('gulp-minify');
const cleanCSS = require('gulp-clean-css');
const rename = require('gulp-rename');
const concat = require('gulp-concat');
 
gulp.task('compress-js', function() {
    return gulp.src([
            './src/smoothscroll.min.js',
            './src/brousel.js'
        ])
        .pipe(concat('brousel.js'))
        .pipe(minify())
        .pipe(gulp.dest('build'))
});
gulp.task('compress-css', () => {
    return gulp.src('./src/brousel.css')
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(rename({ suffix: "-min" }))
        .pipe(gulp.dest('build'));
});
gulp.task('default', gulp.parallel('compress-js', 'compress-css'));
