import { task, watch as _watch, start, src, series } from 'gulp';
import * as browser from 'browser-sync';

const browserSync = browser.create();

task('watch', function watchFun() {
  browserSync.init({
    notify: false, // turn off the browser-sync notification
    server: {
      baseDir: "app"
    }
  });
  _watch('app/*.html', function watchHtmlFun() {
    return src('./app/index.html')
    .pipe(browserSync.stream());
  });
  _watch('app/assets/styles/**/*', series('cssInject'));

  _watch('app/assets/scripts/**/*',series('scriptsRefresh'));
  _watch('app/assets/resizeImages/**/*.jpg', series('resizer'));
});

//take the content of our compiled css file
//hand that over to browser-sync so that
//it can inject those style into the page on the fly
//['styles'] means the 'styles' task have to be run first
//before this cssInject task
task('cssInject', series('styles', function cssInjectFun() {

  //async function pointing toward the source
  return src('./app/temp/styles/style.css')
    .pipe(browserSync.stream());
    //make the content piped and available in the browser
}));

// reload the page every time scripts.js is run
task('scriptsRefresh', series('scripts', function scriptsRefreshFun() {
  return src('./app/temp/scripts/App.js')
    .pipe(browserSync.stream());
}));

task('resizer', series('resize_images', function resizerFun() {
  return browserSync.reload();
}));
