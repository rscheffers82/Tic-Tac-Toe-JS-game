var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();

gulp.task('hello', function(){
	console.log('hello Royko');
});

gulp.task('sass', function(){
	return gulp.src('app/scss/**/*.scss')
    .pipe(sass()) // Converts Sass to CSS with gulp-sass
    .pipe(gulp.dest('app/'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'app'
    },
  })
})

// Gulp watch syntax
gulp.task('watch', ['browserSync'], function (){
  gulp.watch('app/scss/**/*.scss', ['sass']); 
  // Reloads the browser whenever HTML or JS files change
  gulp.watch('app/*.html', browserSync.reload); 
  gulp.watch('app/*.js', browserSync.reload); 
  // Other watchers
})