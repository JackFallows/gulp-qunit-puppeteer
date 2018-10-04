const gulp = require("gulp");
const test = require("../gulp-legacytest");

gulp.task("default", () => {
    return gulp.src("./test/*.js")
        .pipe(test(["./test-namespaces.js"]))
});