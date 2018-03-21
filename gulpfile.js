var gulp = require('gulp');
var sass = require('gulp-sass');

// Compile `*.sass`
gulp.task('sass', () => {
  gulp.src('src/styles/**/*.sass')
    .pipe(sass({
      outputStyle : 'compressed'
    }))
    .pipe(gulp.dest('app/assets/css'));
});

// Watch asset folder for changes
gulp.task('watch', ['sass'], () => {
  gulp.watch('src/styles/**/*', ['sass']);
});

// Set default task to `watch`
gulp.task('default', ['watch']);
