const puppeteer = require("puppeteer");

async function run(html, consolePassthrough, debug) {
    const browser = await puppeteer.launch({ devtools: !!debug });
    const page = await browser.newPage();
    
    if (debug) {
        // This is to wait for the browser window to open
        const delay = debug.delay || 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
    }
    
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