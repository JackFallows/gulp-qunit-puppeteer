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
    })
  </script>
  ${dependencies.map(d => `<script src="${d}"></script>`)}
  ${`<script src="${testsSource}"></script>`}
  <script>
    mocha.checkLeaks();
    mocha.run();
  </script>
</body>
</html>
    `;
}

module.exports = buildHtml;