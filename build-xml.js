function buildXml(results, overall, testsFileName) {
    return `
<testsuite name="${testsFileName}" tests="${overall.total}" failures="${overall.failed}" errors="0" skipped="0" timestamp="${new Date().toGMTString()}" time="${overall.runtime / 100.0}">
    ${results.map(r => `<testcase classname="${r.module}" name="${r.name}" time="${r.runtime / 100.0}"/>`).join('\n\t')}
</testsuite>
    `;
}

module.exports = buildXml;