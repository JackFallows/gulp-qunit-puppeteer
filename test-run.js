const puppeteer = require("puppeteer");

async function run(html) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto("file://" + html);

    const { overall, results } = await page.evaluate("runTests()");
    
    await browser.close();
    return { overall, results };
}

module.exports = run;