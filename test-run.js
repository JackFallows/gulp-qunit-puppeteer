const puppeteer = require("puppeteer");
const path = require("path");

async function run(html) {
    const browser = await puppeteer.launch();
    console.log(await browser.version());

    const page = await browser.newPage();

    let results = "";

    page.on("console", msg => {
        let text = msg.text().slice("stdout: ".length);
        console.log(text);
        results += text;
    });
    
    await page.goto("file://" + html);
    await new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, 2500);
    });
    
    // await page.pdf({path: 'page.pdf', format: 'A4'});

    await browser.close();

    return results;
}

module.exports = run;