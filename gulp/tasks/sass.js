'use strict';
import yargs         from 'yargs';
import gulp          from 'gulp';
import autoprefixer  from 'autoprefixer';

import browser from "browser-sync";
import plugins from "gulp-load-plugins";

// Load all Gulp plugins into one variable
const $ = plugins();

var CONFIG = require('../config.js');

// Check for --production flag
const PRODUCTION = !!(yargs.argv.production);

// Prepare dependencies
// gulp.task('sass:deps', function() {
//   return gulp.src(CONFIG.SASS_DEPS_FILES)
//     .pipe(gulp.dest('_vendor'));
// });

gulp.task('sass', sass);

function sass() {

    const postCssPlugins = [
        // Autoprefixer
        autoprefixer(),
    ].filter(Boolean);

    return gulp.src(['src/assets/scss/foundation_custom.scss','src/assets/scss/stylesheet.scss'])
        .pipe($.sourcemaps.init())
        .pipe($.sass({
            includePaths: CONFIG.SASS_PATHS
        })
            .on('error', $.sass.logError))
        .pipe($.postcss(postCssPlugins))
        .pipe($.if(PRODUCTION, $.cleanCss({ compatibility: 'ie11', advanced:false,
            format: 'keep-breaks' }
        )))
        .pipe($.if(!PRODUCTION, $.sourcemaps.write()))
        .pipe(gulp.dest('dist/assets/css'));
}

