const xmlescape = require("xml-escape");

function writeFailure(testResult) {
    if (testResult.failed === 0) {
        return "";
    }
    
    return `\n\t\t\t<failure message="${xmlescape(testResult.assertions[0].message)}"/>\n\t\t`;
}

function buildXml(results, overall, testsFileName) {
    return `<?xml version="1.0" encoding="UTF-8" ?>
<testsuites>
    <testsuite name="${xmlescape(testsFileName)}" tests="${overall.total}" failures="${overall.failed}" errors="0" skipped="0" timestamp="${new Date().toGMTString()}" time="${overall.runtime}">
        ${results.map(r => `<testcase classname="${xmlescape(r.module)}" name="${xmlescape(r.name)}" time="${r.runtime}"${r.failed === 0 ? '/>' : '>'}${writeFailure(r)}${r.failed === 0 ? '' : '</testcase>'}`).join('\n\t\t')}
    </testsuite>
</testsuites>
    `;
}

module.exports = buildXml;