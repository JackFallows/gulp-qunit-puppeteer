const map = require("map-stream");
const gutil = require("gulp-util");
const fs = require("fs");
const path = require("path");
const Vinyl = require("vinyl");
const hashCode = require("string-hash");
const prepareOptions = require("./prepare-options");
const buildHtml = require("./build-html");
const run = require("./test-run");
const buildXml = require("./build-xml");

const testPlugin = function (options) {
    return map(async function(file, callback) {
        let error;
        let newFile;
        
        try {
            const suiteName = path.basename(file.path, path.extname(file.path));
            let htmlContent;

            const { dependencies, transformFileName, htmlBody, consolePassthrough } = prepareOptions(options, suiteName);
            
            htmlContent = buildHtml(dependencies[suiteName], file.path, htmlBody[suiteName]);

            const fileName = `${suiteName}-${hashCode(htmlContent)}`;
            fs.writeFileSync(fileName + ".html", htmlContent);

            const { overall, results } = await run(path.resolve(fileName + ".html"), consolePassthrough);

            const xml = buildXml(results, overall, suiteName);
            fs.unlinkSync(fileName + ".html");

            let resultsFileName = transformFileName(suiteName) + ".xml";
            newFile = new Vinyl({
                cwd: file.cwd,
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