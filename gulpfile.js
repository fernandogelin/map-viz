var gulp         = require("gulp"),
    sass         = require("gulp-sass"),
    autoprefixer = require("gulp-autoprefixer")

// Compile SCSS files to CSS
gulp.task("sass", function () {
    gulp.src("src/styles/**/*.sass")
        .pipe(sass({
            outputStyle : "compressed"
        }))
        .pipe(autoprefixer({
            browsers : ["last 20 versions"]
        }))
        .pipe(gulp.dest("app/assets/css"))
})

// Watch asset folder for changes
gulp.task("watch", ["sass"], function () {
    gulp.watch("src/styles/**/*", ["sass"])
})

// Set watch as default task
gulp.task("default", ["watch"])
