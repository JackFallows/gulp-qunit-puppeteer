const map = require("map-stream");
const gutil = require("gulp-util");
const fs = require("fs");
const path = require("path");
const Vinyl = require("vinyl");
const buildHtml = require("./build-html");
const hashCode = require("string-hash");
const run = require("./test-run");
const buildXml = require("./build-xml");

const testPlugin = function (dependencies) {
    return map(async function(file, callback) {
        let error;
        let newFile;

        try {
            const htmlContent = buildHtml(dependencies, file.path);

            const fileName = `test-${hashCode(htmlContent)}`;
            fs.writeFileSync(fileName + ".html", htmlContent);

            const { overall, results } = await run(path.resolve(fileName + ".html"));

            const suiteName = path.basename(file.path, path.extname(file.path));
            const xml = buildXml(results, overall, suiteName);
            fs.unlinkSync(fileName + ".html");

            let resultsFileName = `${fileName}-results.xml`;
            newFile = new Vinyl({
                cwd: '/',
                base: path.dirname(resultsFileName),
                path: resultsFileName,
                contents: Buffer.from(xml, 'utf8')
            });
            
            console.log(`Suite: ${suiteName}`, overall);
            if (overall.failed > 0) {
                const failedTests = results.filter(r => r.failed > 0);
                
                const message = failedTests.map(test => `
Suite: ${suiteName}
Module: ${test.module}
Test: ${test.name}
Message: ${test.assertions[0].message}
`).join('\n');
                
                console.error(message);
            }
        }
        catch (e) {
            error = new gutil.PluginError("gulp-legacytest", e, { showStack: true });
        }

        callback(error, newFile);
    });
};

module.exports = testPlugin;