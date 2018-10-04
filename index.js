const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

async function doStuff() {
    const browser = await puppeteer.launch();
    console.log(await browser.version());

    const page = await browser.newPage();

    let results = "";

    page.on("console", msg => {
        let text = msg.text().slice("stdout: ".length);
        console.log(text);
        results += text;
    });
    
    await page.goto("file://" + path.join(__dirname, "test-page.html"));
    
    // await page.pdf({path: 'page.pdf', format: 'A4'});

    await new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, 2500);
    });

    await browser.close();

    fs.writeFileSync("output.xml", results);
}

doStuff();