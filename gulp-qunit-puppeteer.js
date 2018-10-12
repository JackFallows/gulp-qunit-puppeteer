const map = require("map-stream");
const gutil = require("gulp-util");
const fs = require("fs");
const path = require("path");
const Vinyl = require("vinyl");
const buildHtml = require("./build-html");
const hashCode = require("string-hash");
const run = require("./test-run");
const buildXml = require("./build-xml");

const testPlugin = function (options) {
    let globalDependencies;
    let dependencies;
    let transformFileName;
    let htmlBody;
    let consolePassthrough;
    
    if (Array.isArray(options)) {
        dependencies = options;
    } else {
        ({ globalDependencies, dependencies, transformFileName, htmlBody, consolePassthrough } = options || {});
    }

    if (dependencies == null) {
        dependencies = [];
    }
    
    return map(async function(file, callback) {
        let error;
        let newFile;
        
        try {
            const suiteName = path.basename(file.path, path.extname(file.path));
            let htmlContent;

            if (!Array.isArray(dependencies) && !dependencies[suiteName]) {
                dependencies[suiteName] = [];
            }
            
            if (globalDependencies) {
                if (Array.isArray(dependencies)) {
                    dependencies.unshift.apply(dependencies, globalDependencies);
                } else {
                    dependencies[suiteName].unshift.apply(dependencies[suiteName], globalDependencies);
                }
            }

            let html = {};
            if (typeof (htmlBody) === "string") {
                html[suiteName] = htmlBody;
            } else {
                html = htmlBody;
            }
            
            if (Array.isArray(dependencies)) {
                htmlContent = buildHtml(dependencies, file.path, html[suiteName]);    
            } else {
                htmlContent = buildHtml(dependencies[suiteName], file.path, html[suiteName]);
            }

            const fileName = `${suiteName}-${hashCode(htmlContent)}`;
            fs.writeFileSync(fileName + ".html", htmlContent);

            const { overall, results } = await run(path.resolve(fileName + ".html"), consolePassthrough);

            const xml = buildXml(results, overall, suiteName);
            fs.unlinkSync(fileName + ".html");

            if (typeof(transformFileName) !== "function") {
                transformFileName = () => `${fileName}-results`; 
            }
            
            let resultsFileName = transformFileName(suiteName) + ".xml";
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