import gulp from 'gulp';

import CONFIG from '../config.js';

// Copies static assets
gulp.task('copy', function() {
  return gulp.src(CONFIG.ASSETS_FILES)
    .pipe(gulp.dest('dist/assets'));
});
