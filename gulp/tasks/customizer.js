//TODO Work in progress
//
// var cleancss = require('gulp-clean-css');
// var customizer = require('../../customizer/lib');
// var Vinyl = require('vinyl');
// var fs = require('fs');
// var gulp = require('gulp');
// var If = require('gulp-if');
// var path = require('path');
// var Readable = require('stream').Readable;
// // var replace = require('gulp-replace');
// var rename = require('gulp-rename');
// var rimraf = require('rimraf');
// var sass = require('gulp-sass');
// // var uglify = require('gulp-uglify');
// var yaml = require('js-yaml').safeLoad;
// var zip = require('gulp-zip');
// var postcss = require('gulp-postcss');
// var autoprefixer = require('autoprefixer');
// var webpackStream = require('webpack-stream');
// var webpack = require('webpack');
//
// var utils = require('../utils.js');
// var processedArgv = utils.getProccessedArgv();
//
// var FOUNDATION_VERSION = require('../../package.json').version;
// var OUTPUT_DIR = processedArgv.values['--output'] || 'custom-build';
// var CUSTOMIZER_CONFIG;
// var MODULE_LIST;
// var VARIABLE_LIST;
//
// var WEBPACK_CONFIG = {
//   mode: 'development',
//   externals: utils.umdExternals({
//     'jquery': 'jQuery'
//   }),
//   module: {
//     rules: [
//       {
//         test: /.js$/,
//         use: [
//           {
//             loader: 'babel-loader'
//           }
//         ]
//       }
//     ]
//   },
//   output: {
//     libraryTarget: 'umd',
//   }
// };
//
// // Load the configuration file for the customizer. It's a list of modules to load and Sass variables to override
// gulp.task('customizer:loadConfig', function(done) {
//   fs.readFile('customizermt/config.yml', function(err, data) {
//     var moduleListPath = processedArgv.values['--modules'] || '../../customizermt/complete';
//     var moduleList = require(moduleListPath);
//
//     CUSTOMIZER_CONFIG = yaml(data.toString());
//     MODULE_LIST = moduleList.modules;
//     VARIABLE_LIST = moduleList.variables || {};
//     done();
//   });
// });
//
// // Prepare dependencies
// gulp.task('customizer:prepareSassDeps', function() {
//   return gulp.src([
//       'node_modules/@(sassy-lists)/stylesheets/helpers/missing-dependencies',
//       'node_modules/@(sassy-lists)/stylesheets/helpers/true',
//       'node_modules/@(sassy-lists)/stylesheets/functions/contain',
//       'node_modules/@(sassy-lists)/stylesheets/functions/purge',
//       'node_modules/@(sassy-lists)/stylesheets/functions/remove',
//       'node_modules/@(sassy-lists)/stylesheets/functions/replace',
//       'node_modules/@(sassy-lists)/stylesheets/functions/to-list'
//     ])
//     .pipe(gulp.dest('_vendor'));
//
// });
// gulp.task('customizer:prepareSassDepsmt', function() {
//
//   var sassFile = customizer.sassmt(CUSTOMIZER_CONFIG, MODULE_LIST, VARIABLE_LIST);
//   var stream = createStream('_custom_settings.scss', sassFile);
//
//   return stream
//     .pipe(gulp.dest('src/assets/scss'));
// });
//
// // Creates a Sass file from the module/variable list and creates foundation.css and foundation.min.css
// gulp.task('customizer:sassmt', gulp.series('customizer:loadConfig', 'customizer:prepareSassDepsmt', function() {
//   // var sassFile = customizer.sass(CUSTOMIZER_CONFIG, MODULE_LIST, VARIABLE_LIST);
//   // var stream = createStream('foundation.scss', sassFile);
//
//   return gulp.src([
//     'src/assets/scss/stylesheet.scss'])
//     .pipe(sass({
//       includePaths: [
//         'node_modules/foundation-sites/scss',
//         'node_modules/motion-ui/src',
//         'src/assets/scss'
//       ]
//     }))
//     .pipe(postcss([autoprefixer()])) // uses ".browserslistrc"
//     .pipe(gulp.dest(path.join(OUTPUT_DIR, 'css')))
//     .pipe(cleancss({ compatibility: 'ie9' }))
//     .pipe(rename('foundation.min.css'))
//     .pipe(gulp.dest(path.join(OUTPUT_DIR, 'css')))
// }));
//
// gulp.task('customizer:sass', gulp.series('customizer:loadConfig', 'customizer:prepareSassDeps',function() {
//   var sassFile = customizer.sassmt(CUSTOMIZER_CONFIG, MODULE_LIST, VARIABLE_LIST);
//   var stream = createStream('_custom_settings.scss', sassFile);
//
//   return stream
//       .pipe(sass({
//         includePaths: [
//           'node_modules/foundation-sites/scss',
//           'node_modules/motion-ui/src',
//           'src/assets/scss'
//         ]
//       }))
//       .pipe(postcss([autoprefixer()])) // uses ".browserslistrc"
//       .pipe(gulp.dest(path.join(OUTPUT_DIR, 'css')))
//       .pipe(cleancss({ compatibility: 'ie9' }))
//       .pipe(rename('foundation.min.css'))
//       .pipe(gulp.dest(path.join(OUTPUT_DIR, 'css')))
// }));
//
// // Creates a Foundation JavaScript file from the module list, and also copies dependencies (jQuery, what-input)
// gulp.task('customizer:javascript-entry', gulp.series('customizer:loadConfig', function() {
//   var entryFile = customizer.js(CUSTOMIZER_CONFIG, MODULE_LIST);
//   // Create a stream with our entry file
//   var stream = createStream('foundation.js', entryFile);
//
//   return stream
//     .pipe(gulp.dest(path.join(OUTPUT_DIR, 'js/vendor')));
// }));
//
// // Add main CSS and JS files to the build directory and create a ZIP file from it.
// gulp.task('customizer:zip', function (done) {
//   var outputFolder = path.dirname(OUTPUT_DIR);
//   var outputFileName = path.basename(OUTPUT_DIR);
//
//   fs.closeSync(fs.openSync(path.join(OUTPUT_DIR, 'css/app.css'), 'w'));
//   fs.closeSync(fs.openSync(path.join(OUTPUT_DIR, 'js/app.js'), 'w'));
//   fs.writeFileSync(path.join(OUTPUT_DIR, 'js/app.js'), '$(document).foundation()\n');
//
//   return gulp.src(path.join(OUTPUT_DIR, '/**/*'))
//     .pipe(zip(path.basename(outputFileName) + '.zip'))
//     .pipe(gulp.dest(outputFolder));
// });
//
// // Clean the build directory
// gulp.task('customizer:clean', function(done) {
//   rimraf(OUTPUT_DIR, done);
// });
//
// // Creates a custom build by:
// //   - Generating a CSS file
// //   - Generating a JS file
// //   - Copying the index.html file
// //   - Creating a blank app.css file
// //   - Creating an app.js file with Foundation initialization code
// gulp.task('customizer', gulp.series('customizer:sass', 'customizer:zip', 'customizer:clean'));
//
// function createStream(name, content) {
//   // Create a stream with our entry file
//   var stream = new Readable({ objectMode: true });
//   stream._read = function() {};
//   stream.push(new Vinyl({
//     path: name,
//     contents: new Buffer(content)
//   }));
//   stream.push(null);
//   return stream;
// }
