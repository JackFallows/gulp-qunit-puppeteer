const path = require("path");

function buildHtml(dependencies, testsSource) {
    return `
<html>
<head>
  <meta charset="utf-8">
</head>
<body>
  <script src="${path.resolve("../node_modules/qunit/qunit/qunit.js")}"></script> <!-- TODO: resolve relative path -->

  <script>
    window.results = [];

    QUnit.config.autostart = false;
  </script>
  ${dependencies.map(d => `<script src="${d}"></script>`)}
  ${`<script src="${testsSource}"></script>`}
  <script>
    function runTests() {
      return new Promise(resolve => {
        QUnit.testDone(function(testResult) {
            window.results.push(testResult);
        });
          
        QUnit.done(function (overall) {
          resolve({ overall, results: window.results });
        });
          
        QUnit.start();
      })
    }
  </script>
</body>
</html>
    `;
}

module.exports = buildHtml;