import { task, src, dest } from 'gulp';
import modernizr from 'gulp-modernizr';

task('modernizr', function modernizrFun() {
  return src(['./app/assets/styles/**/*.css', './app/assets/scripts/**/*.js'])
    .pipe(modernizr({
      "options": [
        "setClasses",
        "addTest",
        "html5printshiv",
        "testProp"
      ]
    }))
    .pipe(dest('./app/temp/scripts/'));
});
