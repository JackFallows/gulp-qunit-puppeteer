const gulp = require("gulp");
const concat = require("gulp-concat-util");
const gulpIf = require("gulp-if");
const fail = require("gulp-fail");
const fs = require("fs");
const test = require("../gulp-legacytest");

gulp.task("default", () => {
    return gulp.src("./test/*.js")
        .pipe(test({
            dependencies: { "tests": ["./test-namespaces.js"], "tests2": ["./test-namespaces.js"] },
            htmlBody: "<span id='my-elem'></span>"
        }))
        .pipe(concat("TestResults.xml", {
            process(source, filePath) {
                return source.trim().replace("<?xml version=\"1.0\" encoding=\"UTF-8\" ?>\n<testsuites>", "").replace("</testsuites>", "");
            }
        }))
        .pipe(concat.header("<?xml version=\"1.0\" encoding=\"UTF-8\" ?>\n<testsuites>"))
        .pipe(concat.footer("</testsuites>"))
        .pipe(gulp.dest("./"))
        .pipe(gulpIf(function (file) {
            const contents = fs.readFileSync(file.path);
            return contents.includes("<failure message");
        }, fail()));
});

// gulp.task("test2", () => {
//     return gulp.src("./test/tests3.js")
//         .pipe(test({
//             dependencies: { "tests3": ["./test-namespaces.js"] },
//             transformFileName(suiteName) {
//                 return `${suiteName}Results`
//             }
//         }))
//         .pipe(gulp.dest("./"))
//         .pipe(gulpIf(function (file) {
//             const contents = fs.readFileSync(file.path);
//             return contents.includes("<failure message");
//         }, fail()));
// });
//
// gulp.task("default", ["test1", "test2"], () => {
//     return gulp.src("./*.xml")
//         .pipe(concat("TestResultsAll.xml", {
//             process(source, filePath) {
//                 return source.trim().replace("<?xml version=\"1.0\" encoding=\"UTF-8\" ?>\n<testsuites>", "").replace("</testsuites>", "");
//             }
//         }))
//         .pipe(concat.header("<?xml version=\"1.0\" encoding=\"UTF-8\" ?>\n<testsuites>"))
//         .pipe(concat.footer("</testsuites>"))
//         .pipe(gulp.dest("./"))
// });