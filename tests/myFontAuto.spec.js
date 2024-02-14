import { test, expect } from '@playwright/test';

test('test', async ({ browser }) => {
  const context = await browser.newContext({});

  const page = await context.newPage();
  await page.goto('https://www.myfonts.com/collections/grype-foundry');
  await page.waitForSelector("#MainContent");
  await page.pause();

  let imgNum = 1;
  // Row locator (bulk)
  let rowLoc = page.locator("ul[data-classname='gs__cardSlider__list__image']");
  // Row count
  let rowCount = await rowLoc.count();
  console.log("the Row count: "+rowCount);

  // Row iterator
  for (let i = 1; i <= rowCount; i++) {
    console.log("Iteration Level: "+i);
    // Img locator (bulk)
    let imageLoc = page.locator("ul[data-classname='gs__cardSlider__list__image'] img[data-index='" + i + "']");
    // Img count
    let imageCount = await imageLoc.count();
    console.log("the image count: "+imageCount);

    // Img iterator
    for (let j = 0; j < imageCount; j++) {
      let urlstring = await imageLoc.nth(j).getAttribute("src");
      console.log(urlstring);

      // Img download
      page.on('response', async (response) => {
        if (response.url() === urlstring && response.ok()) {
          const imageBuffer = await response.body();
          const fs = require('fs');
          fs.writeFileSync(imgNum + 'downloaded_image.jpg', imageBuffer);
          imgNum++;
          console.log('Image downloaded successfully.');
        }
      });

      // Navigate to the URL of the image
      await page.goto(urlstring);

      // Close the browser if the image is not found
      setTimeout(async () => {
        console.error('Error: Image not found or unable to download.');
      }, 5000); // Set a timeout (5 seconds) for the image to be downloaded
      await page.goBack();
    }
  }

  // Close the browser after all iterations
  await browser.close();
});
