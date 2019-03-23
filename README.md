# gulp-qunit-puppeteer

<div class="alert alert-warning">
    This project is being deprecated by my new "qunit-puppeteer-runner" project, which can be used in Gulp without it specifically being a Gulp plugin.
</div>

Runs QUnit tests with the specified JS dependencies in a Puppeteer instance (using headless Chromium) and outputs the results as JUnit XML.

# Requirements

This plugin uses `async`/`await`, so Node 7.6+ is required.

# Install

```
npm install --save-dev gulp-qunit-puppeteer
```

# Usage

```
const gulp = require("gulp");
const concat = require("gulp-concat-util");
const gulpIf = require("gulp-if");
const fail = require("gulp-fail");
const fs = require("fs");

const test = require("gulp-qunit-puppeteer");                     // require the plugin

gulp.task("default", () => {
    return gulp.src("./test/*.js")                                // specify test suites here
        .pipe(test({                                              // call the test runner here
            globalDependencies: ["./test-namespaces.js"],
            dependencies: { "tests3": ["./test-namespaces-2.js"] },
            htmlBody: "<span id='my-elem'></span>"
        }))
        .pipe(concat("TestResults.xml", {                         // you can combine the outputted test results into one using gulp-concat-util
            process(source, filePath) {
                return source.trim().replace("<?xml version=\"1.0\" encoding=\"UTF-8\" ?>\n<testsuites>", "").replace("</testsuites>", "");
            }
        }))
        .pipe(concat.header("<?xml version=\"1.0\" encoding=\"UTF-8\" ?>\n<testsuites>"))
        .pipe(concat.footer("</testsuites>"))
        .pipe(gulp.dest("./"))                                    // write the output file here
        .pipe(gulpIf(function (file) {                            // use gulp-if and gulp-fail to fail the gulp task if any tests failed
            const contents = fs.readFileSync(file.path);
            return contents.includes("<failure message");
        }, fail()));
});
```

# Options

## globalDependencies

**Type**: Array of JS file paths

Used to specify a set of JS file dependencies that are required by all selected test files.

## dependencies

**Type**: Array of JS file paths _or_ associative array of test suite names (test file name minus `.js` extension) and an array of JS file paths

When just an array of JS file paths, works the same as globalDependencies. When an associative array, allows dependencies to be set for each individual test suite.

## transformFileName

**Type**: function with suiteName as its only parameter

Allows the output XML filename to be transformed based on the test suite name. The `.xml` extension will be added automatically.

## htmlBody

**Type**: string of HTML _or_ associative array of test suite names and a string of HTML

HTML content to render to the autogenerated HTML page's body.

## consolePassthrough

**Type**: boolean

Decides whether to passthrough console output from the test run to the Node console. Default: `false`

## debug

**Type**: boolean _or_ object with `delay` property

Decides whether to launch Puppeteer in non-headless mode, with DevTools open, enabling debugging with the `debugger;` statement. Default: `false`

Passing as an object with a `delay` property set to a number of milliseconds will instigate a delay before Puppeteer loads the page. This is to give the Chromium browser window time to open before starting the tests. If the test code executes before the window is visible, execution may not pause on any breakpoints. Default: `1000` milliseconds.
