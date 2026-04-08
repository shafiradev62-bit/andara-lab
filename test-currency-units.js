const { chromium } = require('@playwright/test');

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });

  const page = await context.newPage();

  // Enable console logging
  page.on('console', msg => {
    if (msg.type() === 'error') console.log('  [CONSOLE ERROR]', msg.text());
  });

  console.log('=== Currency Unit Format Test ===\n');

  try {
    // 1. Go to VPS homepage first
    console.log('[1] Navigating to homepage...');
    await page.goto('http://76.13.17.91', { waitUntil: 'networkidle', timeout: 30000 });
    console.log('  ✓ Homepage loaded:', await page.title());
    await page.screenshot({ path: 'screenshots/01_homepage.png' });
    console.log('  → saved: screenshots/01_homepage.png');

    // 2. Navigate to Data Hub
    console.log('\n[2] Navigating to Data Hub...');
    await page.goto('http://76.13.17.91/data', { waitUntil: 'networkidle', timeout: 30000 });
    await page.screenshot({ path: 'screenshots/02_datahub.png' });
    console.log('  → saved: screenshots/02_datahub.png');

    // 3. Get all dataset cards and their unit values
    console.log('\n[3] Scanning datasets on Data Hub...');
    const datasetCards = await page.$$eval('[class*="border"][class*="cursor-pointer"]', els =>
      els.map(el => {
        const title = el.querySelector('[class*="font-semibold"]')?.textContent?.trim() || '';
        const value = el.querySelector('[class*="text-2xl"], [class*="text-2"]')?.textContent?.trim() || '';
        const unit = el.querySelector('[class*="text-gray-400"]')?.textContent?.trim() || '';
        return { title, value, unit };
      })
    );
    console.log('  Found cards:', datasetCards.length);

    // 4. Find IDR and USD datasets
    console.log('\n[4] Looking for IDR and USD datasets...');
    const idrSets = datasetCards.filter(d => d.unit?.includes('IDR'));
    const usdSets = datasetCards.filter(d =>
      d.unit?.includes('USD') || d.value?.includes('USD') || d.value?.includes('$')
    );

    console.log('  IDR datasets:', idrSets.length, idrSets.map(d => d.title));
    console.log('  USD datasets:', usdSets.length, usdSets.map(d => d.title));

    // 5. Navigate to each IDR dataset detail
    if (idrSets.length > 0) {
      for (const ds of idrSets) {
        console.log(`\n[5] Testing IDR dataset: ${ds.title}`);
        console.log(`    Displayed value: "${ds.value}"`);
        console.log(`    Unit label: "${ds.unit}"`);

        // Click the card to open detail view
        const card = await page.$(`text="${ds.title}"`);
        if (card) {
          await card.click();
          await page.waitForTimeout(2000);
          await page.screenshot({
            path: `screenshots/03_idr_${ds.title.replace(/\s+/g, '_').replace(/[^\w]/g, '')}.png`
          });
          console.log(`  → saved screenshot`);

          // Go back to datahub
          await page.goBack();
          await page.waitForTimeout(1000);
        }
      }
    }

    // 6. Navigate to each USD dataset
    if (usdSets.length > 0) {
      for (const ds of usdSets) {
        console.log(`\n[6] Testing USD dataset: ${ds.title}`);
        console.log(`    Displayed value: "${ds.value}"`);
        console.log(`    Unit label: "${ds.unit}"`);

        const card = await page.$(`text="${ds.title}"`);
        if (card) {
          await card.click();
          await page.waitForTimeout(2000);
          await page.screenshot({
            path: `screenshots/04_usd_${ds.title.replace(/\s+/g, '_').replace(/[^\w]/g, '')}.png`
          });
          console.log(`  → saved screenshot`);
          await page.goBack();
          await page.waitForTimeout(1000);
        }
      }
    }

    // 7. Test via Admin panel if available
    console.log('\n[7] Testing Admin panel — unit type editor...');
    await page.goto('http://76.13.17.91/admin', { waitUntil: 'networkidle', timeout: 30000 });
    await page.screenshot({ path: 'screenshots/05_admin.png' });
    console.log('  → saved: screenshots/05_admin.png');

    // Click on a dataset to open editor
    const datasetItems = await page.$$('[class*="cursor-pointer"], [class*="clickable"]');
    if (datasetItems.length > 0) {
      await datasetItems[0].click();
      await page.waitForTimeout(1500);
      await page.screenshot({ path: 'screenshots/06_admin_editor.png' });
      console.log('  → saved: screenshots/06_admin_editor.png');

      // Check for unit type selector
      const unitTypeSelect = await page.$('select');
      if (unitTypeSelect) {
        const options = await unitTypeSelect.$$eval('option', opts => opts.map(o => o.textContent));
        console.log('  Unit type options found:', options);
      }
    }

    // 8. Final summary
    console.log('\n=== Test Summary ===');
    console.log('All screenshots saved to ./screenshots/');
    console.log('IDR datasets tested:', idrSets.map(d => d.title).join(', '));
    console.log('USD datasets tested:', usdSets.map(d => d.title).join(', '));
    console.log('Status: COMPLETE');

  } catch (err) {
    console.error('\n❌ Test error:', err.message);
    await page.screenshot({ path: 'screenshots/error_state.png' });
    console.log('Error screenshot saved: screenshots/error_state.png');
  } finally {
    await browser.close();
  }
}

// Ensure screenshots dir exists
const fs = require('fs');
if (!fs.existsSync('screenshots')) fs.mkdirSync('screenshots');

run();
