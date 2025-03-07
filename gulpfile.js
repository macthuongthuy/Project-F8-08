const gulp = require('gulp');
const fileinclude = require('gulp-file-include');
const sass = require('gulp-sass')(require('sass'));
const browserSync = require('browser-sync').create();
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const del = require('del');
const sourcemaps = require('gulp-sourcemaps'); // Add sourcemaps package

// Paths
const paths = {
  src: {
    html: 'src/templates/*.html',
    partials: 'src/templates/partials/*.html',
    scss: 'src/assets/scss/**/*.scss',
    css: 'src/assets/css/**/*.css',
    js: 'src/assets/js/**/*.js',
    images: 'src/assets/images/**/*.*',
    fonts: 'src/assets/fonts/**/*.*',
    icons: 'src/assets/icon/**/*.*'
  },
  dist: {
    base: 'dist',
    css: 'dist/assets/css',
    js: 'dist/assets/js',
    images: 'dist/assets/images',
    fonts: 'dist/assets/fonts',
    icons: 'dist/assets/icon'
  },
  watch: {
    html: 'src/templates/**/*.html', // Watch all HTML files including components
    scss: 'src/assets/scss/**/*.scss',
    css: 'src/assets/css/**/*.css',
    js: 'src/assets/js/**/*.js'
  }
};

// Clean dist folder
function clean() {
  return del([paths.dist.base]);
}

// Process HTML files
function html() {
  return gulp.src(paths.src.html)
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(gulp.dest(paths.dist.base))
    .pipe(browserSync.stream());
}

// Process SCSS files with sourcemaps
function styles() {
  return gulp.src(paths.src.scss)
    .pipe(sourcemaps.init()) // Initialize sourcemaps
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(sourcemaps.write('./')) // Write sourcemaps to the same directory
    .pipe(gulp.dest(paths.dist.css))
    .pipe(browserSync.stream());
}

// Copy CSS files with sourcemaps
function css() {
  return gulp.src(paths.src.css)
    .pipe(sourcemaps.init()) // Initialize sourcemaps
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(sourcemaps.write('./')) // Write sourcemaps to the same directory
    .pipe(gulp.dest(paths.dist.css))
    .pipe(browserSync.stream());
}

// Copy JavaScript files with sourcemaps
function scripts() {
  return gulp.src(paths.src.js)
    .pipe(sourcemaps.init()) // Initialize sourcemaps
    .pipe(sourcemaps.write('./')) // Write sourcemaps to the same directory
    .pipe(gulp.dest(paths.dist.js))
    .pipe(browserSync.stream());
}

// Copy Images
function images() {
  return gulp.src(paths.src.images)
    .pipe(gulp.dest(paths.dist.images))
    .pipe(browserSync.stream());
}

// Copy Fonts
function fonts() {
  return gulp.src(paths.src.fonts)
    .pipe(gulp.dest(paths.dist.fonts))
    .pipe(browserSync.stream());
}

// Copy Icons
function icons() {
  return gulp.src(paths.src.icons)
    .pipe(gulp.dest(paths.dist.icons))
    .pipe(browserSync.stream());
}

// Watch files
function watch() {
  browserSync.init({
    server: {
      baseDir: paths.dist.base
    },
    port: 3000,
    open: true
  });

  gulp.watch(paths.watch.html, html);
  gulp.watch(paths.watch.scss, styles);
  gulp.watch(paths.src.html, html);
  gulp.watch(paths.src.partials, html);
  gulp.watch(paths.src.scss, styles);
  gulp.watch(paths.src.css, css);
  gulp.watch(paths.src.js, scripts);
  gulp.watch(paths.src.images, images);
  gulp.watch(paths.src.fonts, fonts);
  gulp.watch(paths.src.icons, icons);
}

// Complex tasks
const build = gulp.series(clean, gulp.parallel(
  html,
  styles,
  css,
  scripts,
  images,
  fonts,
  icons
));

// Default task
exports.clean = clean;
exports.html = html;
exports.styles = styles;
exports.css = css;
exports.scripts = scripts;
exports.images = images;
exports.fonts = fonts;
exports.icons = icons;
exports.build = build;
exports.watch = watch;
exports.default = gulp.series(build, watch);