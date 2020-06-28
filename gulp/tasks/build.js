import { task, src, dest, start, series } from 'gulp';
import imagemin from 'gulp-imagemin';
import del from 'del';
import usemin from 'gulp-usemin';
import rev from 'gulp-rev';
import cssnano from 'gulp-cssnano';
import uglify from 'gulp-uglify';
import * as browser from 'browser-sync';
import htmlmin from 'gulp-htmlmin';

const browserSync = browser.create();

task('previewDist', function previewDistFun() {
  browserSync.init({
    notify: false,
    server: {
      baseDir: 'docs',
    },
  });
});

task('deleteDistFolder', function deleteDistFolderFun() {
  return del('./docs');
});

task('copyGeneralFiles', function copyGeneralFilesFun() {
  var pathsToCopy = [
    './app/**/*',
    '!./app/index.html',
    '!./app/assets/images/**',
    '!./app/assets/resizeImages/**',
    '!./app/assets/styles/**',
    '!./app/assets/scripts/**',
    '!./app/temp',
    '!./app/temp/**',
  ];

  return src(pathsToCopy).pipe(dest('./docs'));
});

task('optimizeImages', function optimizeImagesFun() {
  return src(['./app/assets/images/**/*'])
    .pipe(
      imagemin({
        progressive: true,
        interlaced: true,
        multipass: true,
      })
    )
    .pipe(dest('./docs/assets/images'));
});

task('usemin', function useminFun() {
  return src('./app/index.html')
    .pipe(
      usemin({
        css: [rev, cssnano()],
        js: [ uglify, rev ],
        html: [ htmlmin({ collapseWhitespace: true }) ]
      })
    )
    .pipe(dest('./docs'));
});

task(
  'useminTrigger',
  series(/* 'icons', */ 'deleteDistFolder', 'styles', 'scripts', 'usemin')
);

task(
  'build',
  series(
    //'icons',
    'deleteDistFolder',
    'copyGeneralFiles',
    'optimizeImages',
    'styles',
    'scripts',
    'usemin'
  )
);
