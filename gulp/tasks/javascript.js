import gulp from 'gulp'
import concat  from 'gulp-concat';
import terser from 'gulp-terser';
import rename from 'gulp-rename';

var utils = require('../utils.js');
var CONFIG = require('../config.js');

gulp.task('javascript:custom', function() {
    //for now just copy  these files for now
    return gulp.src(CONFIG.JS_ENTRIES)
        .pipe(gulp.dest('dist/js'));

});

gulp.task('javascript:library', function(){
    //build a library minified library file
    return gulp.src(CONFIG.JS_LIBRARY)
        .pipe(concat('library_scripts.js'))
        .pipe(gulp.dest('dist/js'))
        .pipe(terser({
                mangle: {keep_fnames: true, keep_classnames: true}
                // compress: true
            }).on('error', e => { console.log(e); })
        )
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('dist/js'))
});

// // NOT Used yet
// gulp.task('javascript:deps', function() {
//   return gulp.src(CONFIG.JS_DEPS)
//     .pipe(concat('vendor.js'))
//     .pipe(gulp.dest('dist/js'));
// });

gulp.task('javascript', gulp.parallel('javascript:custom', 'javascript:library') );
