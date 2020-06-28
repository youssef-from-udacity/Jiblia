import { task, src, dest, series, parallel } from 'gulp';
import svgSprite from 'gulp-svg-sprite';
import rename from 'gulp-rename';
import del from 'del';
import svg2png from 'gulp-svg2png';

let config = {
  shape: {
    spacing: {
      padding: 10,
    },
  },
  mode: {
    css: {
      variables: {
        replaceSvgWithPng: function() {
          return function(sprite, render) {
            return render(sprite)
              .split('.svg')
              .join('.png');
          };
        },
      },
      sprite: 'sprite.svg',
      render: {
        css: {
          template: './gulp/templates/sprite.cs',
        },
      },
    },
  },
};

task('beginClean', function beginCleanFun() {
  return del(['./app/temp/sprite', './app/assets/images/sprites']);
});

task('createSprite', function createSpriteFun() {
  return src('./app/assets/images/icons/**/*.svg')
    .pipe(svgSprite(config))
    .on('error', function(error) {
      console.log(error);
    })
    .pipe(dest('./app/temp/sprite/'));
});

task('createPngCopy', function createPngCopyFun() {
  return src('./app/temp/sprite/css/*.svg')
    .pipe(svg2png())
    .pipe(dest('./app/temp/sprite/css'));
});

task('copySpriteGraphic', function copySpriteGraphicFun() {
  return src('./app/temp/sprite/css/*.{svg,png}').pipe(
    dest('./app/assets/images/sprites')
  );
});

task('copySpriteCSS', function copySpriteCSSFun() {
  return src('./app/temp/sprite/css/*.css')
    .pipe(rename('_sprite.scss'))
    .pipe(dest('./app/assets/styles/sass/parts/2-vendor'));
});

task('endClean', function endCleanFun() {
  return del('./app/temp/sprite');
});

task(
  'icons',
  series(
    'beginClean',
    'createSprite',
    'createPngCopy',
    'copySpriteGraphic',
    'copySpriteCSS',
    'endClean'
  )
);
