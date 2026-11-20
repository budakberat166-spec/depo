// Linux/bulut (mobil oturum) için story üretici. Windows'taki story.ps1'in karşılığı.
// Kullanım: node story.js <kart-no> <cikti.png>
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
(async () => {
  const [card = '0', out = 'story.png'] = process.argv.slice(2);
  fs.mkdirSync(path.dirname(path.resolve(out)), { recursive: true });
  const browser = await chromium.launch({ args: ['--allow-file-access-from-files'] });
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  await page.goto('file://' + path.join(__dirname, 'card.html') + '?i=' + card);
  await page.waitForFunction(() => document.title === 'ready', null, { timeout: 30000 });
  await page.waitForFunction(() => { const p = document.getElementById('photo'); return !p.src || p.complete; }, null, { timeout: 30000 }).catch(() => {});
  await page.screenshot({ path: out });
  await browser.close();
  console.log('OK ' + out);
})().catch(e => { console.error(e); process.exit(1); });
