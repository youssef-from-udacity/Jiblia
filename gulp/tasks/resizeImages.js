//! You need both ImageMagick and GraphicsMagick installed on your system to run the tests.
//! brew install imagemagick
//! brew install graphicsmagick
import {task, src, dest} from "gulp";
import imageResize from "gulp-image-resize";
import rename from "gulp-rename";
const arrSizes = [
  {
    name: "--small",
    sizes: [640, 1280]
  }, {
    name: "--meduim",
    sizes: [990, 1980]
  }, {
    name: "--large",
    sizes: [1380, 2760]
  }, {
    name: "--extra-large",
    sizes: [1960, 3840]
  }, {
    name: "--image-resolution",
    sizes: []
  }
];

task("resize_images", function resize_imagesFun(done) {
  arrSizes.forEach(function (element) {
    element.name === "--image-resolution"
      ? imageResolutionCase()
      : element.sizes.forEach(changeSize, element);
  });
  return done();
}
);

function imageResolutionCase() {
  src("./app/assets/resizeImages/*--image-resolution*.{jpg,png,tiff}").pipe(rename(function (path) {
    const element = {
        name: path.basename,
        sizes: [],
        basename: ""
      },
      arr = element.name.split("-"),
      indexOfWord = element.name.search("--image-resolution");
    element.basename = element.name.slice(0, indexOfWord);

    arr.forEach(function (ele) {
      /^\d+$/.test(ele)
        ? element.sizes.push(parseInt(ele))
        : null;
    });

    element.sizes.forEach(changeSize, element);
  }));
}

function changeSize(size) {
  const element = this;
  src("./app/assets/resizeImages/*" + element.name + ".{jpg,png,tiff}").pipe(imageResize({width: size, upscale: true})).pipe(rename(function (path) {
    if (element.basename) {
      path.basename = element.basename + "-" + size.toString();
    } else {
      path.basename += "-" + size.toString();
    }
  })).pipe(dest("./app/assets/images"));
}
