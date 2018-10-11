const map = require("map-stream");
const gutil = require("gulp-util");
const fs = require("fs");
const path = require("path");
const buildHtml = require("./build-html");
const hashCode = require("string-hash");
const run = require("./test-run");
const buildXml = require("./build-xml");

const testPlugin = function (dependencies) {
    return map(async function(file, cb) {
        let error;

        try {
            const htmlContent = buildHtml(dependencies, file.path);

            const fileName = `test-${hashCode(htmlContent)}`;
            fs.writeFileSync(fileName + ".html", htmlContent);

            console.log(path.resolve(fileName + ".html"));
            const { overall, results } = await run(path.resolve(fileName + ".html"));

            const suiteName = path.basename(file.path, path.extname(file.path));
            const xml = buildXml(results, overall, suiteName);
            fs.writeFileSync(`${fileName}-results.xml`, xml);
            fs.unlinkSync(fileName + ".html");

            console.log(overall);
            if (overall.failed > 0) {
                const failedTests = results.filter(r => r.failed > 0);
                
                const message = failedTests.map(test => `
Suite: ${suiteName}
Module: ${test.module}
Test: ${test.name}
Message: ${test.assertions[0].message}
`).join('\n');
                
                throw new Error(message);
            }
        }
        catch (e) {
            error = new gutil.PluginError("gulp-legacytest", e, { showStack: true });
        }

        cb(error, file);
    });
};

module.exports = testPlugin;