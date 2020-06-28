import { task, src as _src, dest as _dest } from 'gulp';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import cssvars from 'postcss-simple-vars';
import nested from 'postcss-nested';
import cssImport from 'postcss-import';
import mixins from 'postcss-mixins';
import hexrgba from 'postcss-hexrgba';
import { init, write } from 'gulp-sourcemaps';
import sass from 'gulp-sass';
import uncss from 'gulp-uncss';
import gulpif from 'gulp-if';
import config from './config';


// Configiration for gulp-uncss plugin.
const unCssIgnore = [
  /(#|\.)fancybox(-[a-zA-Z]+)?/,
  /tooltip/,
  '.modal'
];

task('styles', function stylesFun() {
   return _src('./app/assets/styles/sass/style.scss')
   .pipe(init())
   .pipe(sass({
    includePaths: ['./node_modules', './bower_components'],
    outputStyle: 'expanded',
    errLogToConsole: true,
  }))
        /**
     * You can use this feature if you have a lot of vendor css/scss libs.
     * The main problem with this plugin - finding selector in js file.
     * Use unCssIgnore to prevent removing some classes/ids.
     * If you have some solution - make pull request/open issue.
     */

    .pipe(postcss([cssImport,mixins, cssvars, nested, hexrgba, autoprefixer]))
    .on('error', function(errorInfo) {
      console.log(errorInfo.toString());
      this.emit('end');
    })
    .pipe(gulpif(
      config.css.uncss,
      uncss({
        html: ['./app/**/*.html'],
        ignore: unCssIgnore,
      }))
    )
    .pipe(write('./maps'))
    .pipe(_dest('./app/temp/styles'));
});

