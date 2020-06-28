import { task, series } from 'gulp';
import webpack from 'webpack';
import webpackConfig from '../../webpack.config.js';

task('scripts', series('modernizr', function scriptsFun(done) {
   return webpack(webpackConfig, function(err, stats){
    if(err) {
     console.log(err.toString());
  }
     console.log(stats.toString());
     done();
  }); 
}));
