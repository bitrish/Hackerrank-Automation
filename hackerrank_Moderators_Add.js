/*The Aim of this project is to get the knowledge of automation i.e, how can we automate the repititive Work using js Commands and node module (Puppeteer)*/
let minimist = require("minimist");
let fs = require("fs");
let puppeteer = require("puppeteer");
// node hackerrank_Project.js --url=https://www.hackerrank.com/auth/login --config=config.JSON

let args = minimist(process.argv);
let url = args.url;

let configJSON = fs.readFileSync("config.JSON", "utf-8");
let config = JSON.parse(configJSON);

// await is used in function which have async keyword used before declaration
(async function () {

    // Launching browser and getting pages
    let browser = await puppeteer.launch({
        headless: false,
        defaultViewport:null,
        args: ['--start-maximized']
    });
    let pages = await browser.pages();
    let page = pages[0];

    
    await page.goto(url);
    await page.waitFor(200);
    await page.waitForSelector("input[type='text']");
    await page.type("input[type='text']",config.userid,{delay:100});
    
    await page.waitFor(200);
    await page.waitForSelector("input[type='password']");
    await page.type("input[type='password']",config.password,{delay:100});

    await page.waitFor(200);
    await page.waitForSelector("button[type='submit']");
    await page.click("button[type='submit']");

    await page.waitFor(200);
    await page.waitForSelector("a[data-analytics='NavBarContests']");
    await page.click("a[data-analytics='NavBarContests']");

    await page.waitFor(200);
    await page.waitForSelector("a[href='/administration/contests/']");
    await page.click("a[href='/administration/contests/']");
    

    await page.waitForSelector("a.backbone.block-center");
    let curls=await page.$$eval("a.backbone.block-center",function(atags){
        let urls=[];
        for(let i=0;i<atags.length;i++)
        {
            let url=atags[i].getAttribute("href");
            urls.push(url);
        }
        return urls;
    });
    
    await page.waitForSelector("a[data-attr1='Last']");
    let numPages=await page.$eval("a[data-attr1='Last']",function(atag){
        let totalPages=parseInt(atag.getAttribute("data-page"));
        return totalPages;
    });
    //console.log(numPages);
    for(let j=0;j<numPages;j++)
    {
        for(let i=0;i<curls.length;i++)
        {
            let curl=curls[i];
            let ctab=await browser.newPage();
            await saveModerator(ctab,"https://www.hackerrank.com"+curl,config.moderators);
            await ctab.close();
            await page.waitFor(2000);
        }
        if(j<numPages)
        {
            await page.waitForSelector("a[data-attr1='Right']");
            await page.click("a[data-attr1='Right']");
        }
    }

})();

async function saveModerator(ctab,fullUrl,moderator){
        
        await ctab.goto(fullUrl);
        await ctab.bringToFront();
        await ctab.waitFor(5000);
        
        await ctab.waitForSelector("li[data-tab='moderators']");
        await ctab.click("li[data-tab='moderators']");

        await ctab.waitFor(2000);
        await ctab.waitForSelector("#moderator");
        await ctab.click("#moderator");

        await ctab.waitFor(2000);
        await ctab.waitForSelector("#moderator");
        await ctab.type("#moderator","bitrish",{delay:100});
        await ctab.keyboard.press("Enter");
}

