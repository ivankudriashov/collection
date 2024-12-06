const gulp = require('gulp');
const plumber = require('gulp-plumber');
const del = require('del');
const browserSync = require('browser-sync').create();
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const mediaquery = require('postcss-combine-media-query');
const cssnano = require('cssnano');
const htmlMinify = require('html-minifier');
const sass = require('gulp-sass')(require('sass'));

function serve() {
  browserSync.init({
    server: {
      baseDir: './dist'
    }
  });
}

function scss() {
  const plugins = [
      autoprefixer(),
      mediaquery(),
      // cssnano()
  ];
  return gulp.src('src/styles/index.scss')
        .pipe(sass())
        .pipe(postcss(plugins))
        .pipe(gulp.dest('dist/'))
        .pipe(browserSync.reload({stream: true}));
}

function html() {
  const options = {
	  removeComments: true,
	  removeRedundantAttributes: true,
	  removeScriptTypeAttributes: true,
	  removeStyleLinkTypeAttributes: true,
	  sortClassName: true,
	  useShortDoctype: true,
	  collapseWhitespace: true,
		minifyCSS: true,
		keepClosingSlash: true
	};
  return gulp.src('src/**/*.html')
        .pipe(plumber())
        .on('data', function(file) {
		      const buferFile = Buffer.from(htmlMinify.minify(file.contents.toString(), options))
		      return file.contents = buferFile
		    })
				.pipe(gulp.dest('dist/'))
        .pipe(browserSync.reload({stream: true}));
}

function images() {
  return gulp.src('src/images/**/*.{jpg,png,svg,gif,ico,webp,avif}', { encoding: false })
              .pipe(gulp.dest('dist/images'))
              .pipe(browserSync.reload({stream: true}));
}

function icons() {
  return gulp.src('src/icons/**/*.{jpg,png,svg,gif,ico,webp,avif}', { encoding: false })
              .pipe(gulp.dest('dist/icons'))
              .pipe(browserSync.reload({stream: true}));
}

function fonts() {
  return gulp.src('src/fonts/**/*.{woff2,ttf}', { encoding: false })
              .pipe(gulp.dest('dist/fonts'))
              .pipe(browserSync.reload({stream: true}));
}

function clean() {
  return del('dist');
}

function watchFiles() {
  gulp.watch(['src/**/*.html'], html);
  gulp.watch(['src/fonts/**/*.{woff2,ttf}'], fonts);
  gulp.watch(['src/styles/**/*.scss'], scss);
  gulp.watch(['src/**/*.{jpg,png,svg,gif,ico,webp,avif}'], images);
  gulp.watch(['src/**/*.{jpg,png,svg,gif,ico,webp,avif}'], icons);
}

const build = gulp.series(clean, gulp.parallel(html, scss, images, icons, fonts));
const watchapp = gulp.parallel(build, watchFiles, serve);

exports.html = html;
exports.scss = scss;
exports.fonts = fonts;
exports.images = images;
exports.icons = icons;
exports.clean = clean;

exports.build = build;
exports.watchapp = watchapp;
exports.default = watchapp;