const map = require("map-stream");
const gutil = require("gulp-util");
const fs = require("fs");
const path = require("path");
const buildHtml = require("./build-html");
const hashCode = require("./hash-code");
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
            const xml = buildXml(results, overall, path.basename(file.path, path.extname(file.path)));
            fs.writeFileSync(`${fileName}-results.xml`, xml);
            fs.unlinkSync(fileName + ".html");
        }
        catch (e) {
            error = new gutil.PluginError("gulp-legacytest", e, { showStack: true });
        }

        cb(error, file);
    });
};

module.exports = testPlugin;