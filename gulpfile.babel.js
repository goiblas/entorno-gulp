import gulp from 'gulp';
import plumber from 'gulp-plumber';
import sass from 'gulp-sass';
import config from './gulp.config.json';
import browserSync from 'browser-sync';
import panini from 'panini';
import autoprefixer from 'gulp-autoprefixer';
import runsequence from 'run-sequence';
import babel from 'gulp-babel';
import concat from 'gulp-concat';
import del from 'del';
import imagemin from 'gulp-imagemin';


// generador de css
gulp.task('css', () => {
    return gulp.src(config.scss.src)
        .pipe(plumber())
        .pipe(sass({
            outputStyle: 'extended'
        }))
        .pipe(gulp.dest(config.scss.dest))
        .pipe(browserSync.reload({ stream: true }));
});
gulp.task('min:css', () => {
    return gulp.src(config.scss.src)
        .pipe(sass({
            outputStyle: 'compressed',
        }))
        .pipe(autoprefixer({
            browsers: [
                'last 2 versions',
                'ie >= 10'
            ],
            cascade: false
        }))
        .pipe(gulp.dest(config.scss.dest))
});


//generador de javascript
gulp.task('js', () => {
    return gulp.src(config.js.src)
        .pipe(babel({
            presets: ["env"]
        }))
        .pipe(concat(config.js.name))
        .pipe(gulp.dest(config.js.dest))
        .pipe(browserSync.reload({ stream: true }));
});
gulp.task('min:js', () => {
    return gulp.src(config.js.src)
        .pipe(babel({
            presets: ["env"]
        }))
        .pipe(concat(config.js.name))
        .pipe(gulp.dest(config.js.dest))
});


// generador de html
gulp.task('html', () => {
    gulp.src(config.templates.src)
        .pipe(panini({
            root: `${config.templates.folder}/pages`,
            layouts: `${config.templates.folder}/layouts`,
            partials: `${config.templates.folder}/partials`,
            helpers: `${config.templates.folder}/helpers`,
            data: `${config.templates.folder}/data`
        }))
        .pipe(gulp.dest(config.templates.dest))
        .pipe(browserSync.reload({ stream: true }));
});


// copio plugins
gulp.task('plugins', () => {
    return gulp.src(config.plugins.src)
        .pipe(gulp.dest(config.plugins.dest))
});


// minimizar imagenes
gulp.task('img', () => {
    return gulp.src(config.img.src)
        .pipe(gulp.dest(config.img.dest))
});
gulp.task('min:img', () =>
    gulp.src(config.img.src)
        .pipe(imagemin([
            imagemin.gifsicle({ interlaced: true }),
            imagemin.jpegtran({ progressive: true }),
            imagemin.optipng({ optimizationLevel: 5 }),
            imagemin.svgo({
                plugins: [
                    { removeViewBox: true },
                    { cleanupIDs: false }
                ]
            })
        ]))
        .pipe(gulp.dest(config.img.dest))
);

// levanto el servidor
gulp.task('dev', () => {
    browserSync.init({
        server: {
            baseDir: config.templates.dest
        },
        ghostMode: false,
        online: true
    });

    gulp.watch(config.scss.watch, ['css']);
    gulp.watch(config.js.watch, ['js']);
    gulp.watch([config.templates.watch], ['reset:html', 'html']);
});

gulp.task('clean', del.bind(null, ['dist']));

// genero la carpeta de distribuación 
gulp.task('build', ['clean'], () => {
    runsequence('html', ['css', 'js', 'plugins', 'img'])
});

// generar archivos definitivos
gulp.task('deploy', ['clean'], () => {
    runsequence('html', ['min:css', 'min:js', 'plugins', 'min:img'])
})

// reset para el html
gulp.task('reset:html', (done) => {
    panini.refresh();
    done();
});


gulp.task('default', () => {
    runsequence('build', ['dev'])
});