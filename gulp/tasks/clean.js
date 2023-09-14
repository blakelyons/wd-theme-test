import gulp          from 'gulp';
import rimraf        from 'rimraf';

// Erases the dist folder
// This happens every time a build starts
gulp.task('clean', function(done) {
  rimraf('dist', done);
});
