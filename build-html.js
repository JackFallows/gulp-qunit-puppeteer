function buildHtml(dependencies, testsSource) {
    return `
<html>
<head>
  <meta charset="utf-8">
  <title>Mocha Tests</title>
  <link href="../node_modules/mocha/mocha.css" rel="stylesheet" />
</head>
<body>
  <div id="mocha"></div>

  <script src="https://unpkg.com/chai/chai.js"></script>
  <script src="../node_modules/mocha/mocha.js"></script>

  <script>
    mocha.setup({
      ui: 'bdd',
      reporter: "xunit"
    });

    window.assert = chai.assert;
  </script>
  ${dependencies.map(d => `<script src="${d}"></script>`)}
  ${`<script src="${testsSource}"></script>`}
  <script>
    function runTests() {
      return new Promise((resolve) => {
        mocha.checkLeaks();
        mocha.run();
        resolve();
      });
    }
  </script>
</body>
</html>
    `;
}

module.exports = buildHtml;