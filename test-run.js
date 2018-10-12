const puppeteer = require("puppeteer");

async function run(html, consolePassthrough) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    if (consolePassthrough) {
        page.on("console", function (msg) {
            console.log(msg.text());
        });
    }
    
    await page.goto("file://" + html);

    const { overall, results } = await page.evaluate("runTests()");
    
    await browser.close();
    return { overall, results };
}

module.exports = run;