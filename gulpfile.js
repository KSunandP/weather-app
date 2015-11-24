var gulp = require('gulp');
var concat = require('gulp-concat');
var less = require('gulp-less');
var uglify = require('gulp-uglify');
var babel = require('gulp-babel');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('build-less', function(){
    return gulp.src('assets/css/**/*.less')
        .pipe(less())
        .pipe(concat('core.css'))
        .pipe(gulp.dest('assets/css/dist'));
});


gulp.task('services', function () {
    return gulp.src('assets/js/services/*.js')
        .pipe(sourcemaps.init())
        .pipe(babel({ presets: ['react'] }))
        //.pipe(uglify())
        .pipe(concat('services.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('assets/js/dist'));
});

gulp.task('factories', function () {
    return gulp.src('assets/js/factories/*.js')
        .pipe(sourcemaps.init())
        .pipe(babel({ presets: ['react'] }))
        //.pipe(uglify())
        .pipe(concat('factories.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('assets/js/dist'));
});

gulp.task('controllers', function () {
    return gulp.src('assets/js/controllers/*.js')
        .pipe(sourcemaps.init())
        .pipe(babel({ presets: ['react'] }))
        //.pipe(uglify())
        .pipe(concat('controllers.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('assets/js/dist'));
});

gulp.task('components', function () {
    return gulp.src('assets/js/components/*.js')
        .pipe(sourcemaps.init())
        .pipe(babel({ presets: ['react'] }))
        //.pipe(uglify())
        .pipe(concat('components.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('assets/js/dist'));
});

gulp.task('directives', function () {
    return gulp.src('assets/js/directives/*.js')
        .pipe(sourcemaps.init())
        .pipe(babel({ presets: ['react'] }))
        //.pipe(uglify())
        .pipe(concat('directives.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('assets/js/dist'));
});

gulp.task('watch', function() {
    gulp.watch('assets/css/**/*.less', ['build-less']);
    gulp.watch('assets/js/services/*.js', ['services']);
    gulp.watch('assets/js/factories/*.js', ['factories']);
    gulp.watch('assets/js/controllers/*.js', ['controllers']);
    gulp.watch('assets/js/components/*.js', ['components']);
    gulp.watch('assets/js/directives/*.js', ['directives']);
});

gulp.task('default', ['build-less', 'services', 'factories', 'controllers', 'components', 'directives', 'watch']);