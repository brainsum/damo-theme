// @codingStandardsIgnoreFile
//
// @todo Merge the whole Gulp process with damo_base somehow
// @todo Simplify Gulp builds, reduce configs, etc.
//
var gulp = require('gulp');
var sass = require('gulp-sass');
var csscomb = require('gulp-csscomb');
var eslint = require('gulp-eslint');
var autoprefixer = require('gulp-autoprefixer');

const sourceMaps = require('gulp-sourcemaps');

gulp.task('sass', function () {
  return gulp
    .src('scss/**/*.{scss,sass}', { base: './scss' })
    .pipe(sass({
      outputStyle: 'expanded',
      precision: 3,
    }).on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(csscomb())
    .pipe(gulp.dest('css'));
});

gulp.task('csscomb', function () {
  return gulp
    .src('css/**/*.css', { base: './css' })
    .pipe(csscomb())
    .pipe(gulp.dest('css'));
});

gulp.task('eslint', function () {
  return gulp
    .src('js/**/*.js', { base: './js' })
    .pipe(eslint())
    .pipe(eslint.format());
});

gulp.task('lint', ['csscomb']);

// gulp.task('watch', ['lint'], function () {
gulp.task('watch', function () {
  gulp.watch('./scss/**/*.{scss,sass}', ['sass']);
  // gulp.watch('./js/**/*.js', ['eslint']);
});

gulp.task('run', ['sass', 'lint']);

gulp.task('default', ['run']);

gulp.task('fa-fonts', function() {
  return gulp.src('./node_modules/components-font-awesome/webfonts/**.*')
    .pipe(gulp.dest('./css/fa_fonts/'));
});

gulp.task('fa-scss', function() {
  return gulp.src('./node_modules/components-font-awesome/scss/**.*')
    .pipe(gulp.dest('./scss/font_awsome'));
});

gulp.task('fa', ['fa-fonts', 'fa-scss']);
