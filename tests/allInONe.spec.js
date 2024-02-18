import { test, expect } from "@playwright/test";
import * as subprocess from 'child_process';

test("test", async ({ browser }) => {
  const context = await browser.newContext({});

  const page = await context.newPage();
  await page.goto(
    "https://www.myfonts.com/collections/cultivated-mind-foundry"
  );
  await page.pause();

  await page.waitForTimeout(10000);
  await page.locator("#onetrust-accept-btn-handler").click();

  await page.evaluate(async () => {
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
    for (let i = 0; i < document.body.scrollHeight; i += 500) {
      window.scrollTo(0, i);
      await delay(2);
    }
  });

  let imgNum = 1;
  let imageLoc = page.locator(
    "ul[data-classname='gs__cardSlider__list__image'] img"
  );
  let imageCount = await imageLoc.count();
  console.log("the image count: " + imageCount);

  let imageUrls = []; // Array to store image URLs

  for (let j = 1; j < imageCount; j++) {
    let originalUrl = await imageLoc.nth(j).getAttribute("src");
    let urlstring = originalUrl.replace('width=400', 'width=600');
    console.log(urlstring);

    imageUrls.push(urlstring);

    // Move to a new URL
    await page.goto(
      "https://www.myfonts.com/collections/cultivated-mind-foundry"
    );
    await page.evaluate(() => window.scrollTo(0,0));
    await page.waitForTimeout(2000);
    await page.evaluate(async () => {
      const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
      for (let i = 0; i < document.body.scrollHeight; i += 500) {
        window.scrollTo(0, i);
        await delay(2);
      }
    });
  }

  // Call the Python script to download images
  const pythonScriptPath = 'downloader.py';
  const imageUrlsFile = 'image_urls3.txt';
  const outputFolder = 'downloaded_images2';
  const command = `python ${pythonScriptPath} ${imageUrlsFile} ${outputFolder}`;

  const process = subprocess.exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
  });

  process.on('close', (code) => {
    console.log(`Python script exited with code ${code}`);
  });

  // Close the browser after all iterations
  await browser.close();
});
