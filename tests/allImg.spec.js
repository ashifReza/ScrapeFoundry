import { test, expect } from "@playwright/test";

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
  // Img locator (bulk)
  let imageLoc = page.locator(
    "ul[data-classname='gs__cardSlider__list__image'] img"
  );
  // Img count
  let imageCount = await imageLoc.count();
  console.log("the image count: " + imageCount);

  // Img iterator
  for (let j = 1; j < imageCount; j++) {
    let originalUrl = await imageLoc.nth(j).getAttribute("src");
    let urlstring = originalUrl.replace('width=400', 'width=600');
    console.log(urlstring);

    // Img download
    let downloadedImages = []; // Array to store downloaded image URLs

    page.on("response", async (response) => {
      if (response.url() === urlstring && response.ok()) {
        // Check if the image has already been downloaded
        if (downloadedImages.includes(urlstring)) {
          console.log("Image already downloaded. Moving to the next URL.");
          //await page.goBack(); // Go back to the previous page to navigate to the next URL
          return;
        }

        const imageBuffer = await response.body(); // Use response.buffer() to get the binary buffer directly
        const fs = require("fs");
        const imageName = imgNum + "_downloaded_image.jpg"; // Append '_downloaded_image' to avoid overwriting existing files
        fs.writeFileSync(imageName, imageBuffer);

        // Add the downloaded image URL to the array
        downloadedImages.push(urlstring);

        imgNum++;
        console.log("Image downloaded successfully.");
        console.log(j);

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
    });


    await page.evaluate(async () => {
      const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
      for (let i = 0; i < document.body.scrollHeight; i += 500) {
        window.scrollTo(0, i);
        await delay(2);
      }
    });
    await page.waitForTimeout(1000);
    await page.goto(urlstring);

    // Close the browser if the image is not found or unable to download
    setTimeout(async () => {
      if (!downloadedImages.includes(urlstring)) {
        console.error("Error: Image not found or unable to download.");
      }
    }, 1000); // Set a timeout (5 seconds) for the image to be downloaded
  }

  // Close the browser after all iterations
  await browser.close();
});
