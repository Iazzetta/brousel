const gulp = require('gulp');
const minify = require('gulp-minify');
 
gulp.task('m', function() {
  return gulp.src(['brousel.js'])
    .pipe(minify())
    .pipe(gulp.dest('build'))
});
